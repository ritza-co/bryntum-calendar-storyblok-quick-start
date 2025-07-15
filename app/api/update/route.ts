export async function PUT(request: Request): Promise<Response> {
    const reqBody = await request.json();
    try {
        const res = await fetch(
      `https://mapi.storyblok.com/v1/spaces/${process.env.STORYBLOK_BRYNTUM_CALENDAR_SPACE_ID}/stories/${process.env.STORYBLOK_BRYNTUM_CALENDAR_STORY_ID}`,
      {
          method  : 'PUT',
          headers : {
              Authorization  : process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN || '',
              'Content-Type' : 'application/json'
          },
          body : JSON.stringify({ story : reqBody.story })
      }
        );
        const data = await res.json();

        return Response.json(data);
    }
    catch (error) {
        console.error('Loading events and resources data failed', error);
        return new Response('Loading events and resources data failed', {
            status : 500
        });
    }
}