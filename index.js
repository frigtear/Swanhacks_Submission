Bun.serve({

  port:3001,

  async fetch(req) {
    const url = new URL(req.url);

    // Serve the HTML file for the root route
    if (url.pathname === "/") {
      return new Response(Bun.file('source/index.html'), {
        status: 200,
        headers: { "Content-Type": "text/html" }
      });
    }

    // Serve the CSS file
    if (url.pathname === "/client.js") {
      return new Response(Bun.file('source/client.js'), {
        status: 200,
        headers: { "Content-Type": "application/javascript" }
      });
    }

    // Serve the JS file
    if (url.pathname === "/teacher.js") {
      return new Response(Bun.file('source/teacher.js'), {
        status: 200,
        headers: { "Content-Type": "application/javascript" }
      });
    }


    if (url.pathname == "/styles.css"){
      return new Response(Bun.file("source/styles.css"),{
        status:200
      })
    }

    // If the requested file is not found
    return new Response('Not Found', { status: 404 });
  },
});
