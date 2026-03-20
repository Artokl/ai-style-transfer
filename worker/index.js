export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    const json = (data, status = 200) =>
      new Response(JSON.stringify(data), {
        status,
        headers: {
          "Content-Type": "application/json",
          ...cors,
        },
      });

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/generate") {
      try {
        const body = await request.json();

        const imageUrl = body?.image_url;
        const styleId = String(body?.style_id || "cartoon3d").trim();
        const extra = String(body?.extra || "").trim();

        if (!imageUrl) {
          return json({ error: "image_url is required" }, 400);
        }

        const STYLE_PROMPTS = {
          anime: [
            "Transform the uploaded photo into a polished anime portrait.",
            "Keep the person clearly recognizable and preserve identity, facial structure, hairstyle, pose, camera angle, and composition.",
            "Use clean line art, expressive anime eyes, refined facial features, smooth cel shading, and vibrant but balanced colors.",
            "Make the result high quality, aesthetic, detailed, and visually appealing.",
            "Avoid distorted anatomy, extra limbs, broken hands, blurry face, low detail, washed colors, and deformed eyes.",
          ].join(" "),

          cartoon3d: [
            "Transform the uploaded photo into a premium 3D cartoon character portrait.",
            "Keep the person recognizable and preserve identity, hairstyle, pose, framing, and composition.",
            "Use soft cinematic lighting, smooth skin shading, polished 3D forms, expressive face, appealing proportions, and a premium animated movie look.",
            "Make it cute, clean, high-detail, and visually rich.",
            "Avoid uncanny facial features, broken anatomy, low detail, blur, waxy artifacts, and malformed hands.",
          ].join(" "),

          ghibli: [
            "Transform the uploaded photo into a dreamy hand-painted animated portrait with a whimsical cinematic feel.",
            "Keep the person recognizable and preserve identity, pose, hairstyle, framing, and composition.",
            "Use soft painterly textures, gentle color palette, warm natural light, charming expression, and a magical storybook atmosphere.",
            "Make the image elegant, detailed, calm, and emotionally warm.",
            "Avoid harsh contrast, plastic skin, deformed anatomy, broken facial features, and low-detail rendering.",
          ].join(" "),

          cyberpunk: [
            "Transform the uploaded photo into a futuristic cyberpunk portrait.",
            "Keep the person recognizable and preserve identity, pose, camera angle, hairstyle, and composition.",
            "Use neon lighting, moody shadows, glossy reflections, electric blue and magenta accents, high contrast, and a premium sci-fi city-night atmosphere.",
            "Make it cinematic, sharp, stylish, and high-detail.",
            "Avoid messy anatomy, blurred face, low-detail rendering, random accessories, and distorted proportions.",
          ].join(" "),

          cinematic: [
            "Transform the uploaded photo into a cinematic realistic portrait.",
            "Keep the person clearly recognizable and preserve identity, natural facial structure, hairstyle, pose, and framing.",
            "Use premium photography aesthetics, realistic skin texture, cinematic color grading, natural depth, soft contrast, and professional lighting.",
            "Make the result look high-end, polished, realistic, and visually striking.",
            "Avoid over-stylization, plastic skin, deformed anatomy, blur, low detail, and unnatural facial changes.",
          ].join(" "),

          oil: [
            "Transform the uploaded photo into a beautiful oil painting portrait.",
            "Keep the person recognizable and preserve identity, pose, hairstyle, and composition.",
            "Use elegant painterly brushstrokes, textured canvas feeling, rich color blending, artistic lighting, and a classic fine-art look.",
            "Make it detailed, expressive, and museum-quality.",
            "Avoid muddy colors, broken anatomy, distorted face, low detail, and messy brush artifacts.",
          ].join(" "),
        };

        const basePrompt = STYLE_PROMPTS[styleId] || STYLE_PROMPTS.cartoon3d;

        const fullPrompt = [
          basePrompt,
          extra
            ? `Additional user instructions: ${extra}. Follow these extra instructions carefully as long as they do not conflict with preserving the person's identity, pose, and overall image integrity.`
            : "",
        ]
          .filter(Boolean)
          .join(" ");

        // 1. submit to fal
        const submit = await fetch(
          "https://queue.fal.run/fal-ai/nano-banana-2/edit",
          {
            method: "POST",
            headers: {
              Authorization: `Key ${env.FAL_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt: fullPrompt,
              image_urls: [imageUrl],
            }),
          }
        );

        const submitData = await submit.json();

        if (!submit.ok) {
          return json(
            {
              error: "Failed to submit generation request",
              details: submitData,
            },
            500
          );
        }

        if (!submitData?.request_id || !submitData?.status_url || !submitData?.response_url) {
          return json(
            {
              error: "Invalid response from fal",
              details: submitData,
            },
            500
          );
        }

        const statusUrl = submitData.status_url;
        const responseUrl = submitData.response_url;

        // 2. polling
        let result = null;

        for (let i = 0; i < 30; i++) {
          await new Promise((r) => setTimeout(r, 1500));

          const statusRes = await fetch(statusUrl, {
            headers: {
              Authorization: `Key ${env.FAL_KEY}`,
            },
          });

          const statusData = await statusRes.json();
          const status = String(statusData?.status || statusData?.state || "").toUpperCase();

          if (status.includes("COMPLETED") || status.includes("SUCCEEDED")) {
            const resultRes = await fetch(responseUrl, {
              headers: {
                Authorization: `Key ${env.FAL_KEY}`,
              },
            });

            const resultData = await resultRes.json();

            const image =
              resultData?.images?.[0]?.url ||
              resultData?.output?.images?.[0]?.url ||
              null;

            if (!image) {
              return json(
                {
                  error: "Generation completed but no image returned",
                  details: resultData,
                },
                500
              );
            }

            result = image;
            break;
          }

          if (status.includes("FAILED") || status.includes("ERROR")) {
            return json(
              {
                error: "Generation failed",
                details: statusData,
              },
              500
            );
          }
        }

        if (!result) {
          return json({ error: "Timeout waiting for image" }, 500);
        }

        return json({
          image_url: result,
          style_id: styleId,
          used_prompt: fullPrompt,
        });
      } catch (e) {
        return json(
          {
            error: "Server error",
            details: String(e),
          },
          500
        );
      }
    }

    return new Response("ok", {
      headers: cors,
    });
  },
};