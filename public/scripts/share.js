const buttonShareTopTracks = document.getElementById("shareTopTracks");
const buttonShareTopArtists = document.getElementById("shareTopArtists");

const webShareSupported = 'canShare' in navigator;
buttonShareTopTracks.textContent = webShareSupported ? 'Share' : 'Download';
buttonShareTopArtists.textContent = webShareSupported ? 'Share' : 'Download';

const shareOrDownload = async (blob, fileName) => {
  if (webShareSupported) {
    const data = {
      files: [
        new File([blob], fileName, {
          type: blob.type,
        }),
      ]
    };
    if (navigator.canShare(data)) {
      try {
        await navigator.share(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err.name, err.message);
        }
      } finally {
        return;
      }
    }
  }

  const a = document.createElement('a');
  a.download = fileName;
  a.style.display = 'none';
  a.href = URL.createObjectURL(blob);
  a.addEventListener('click', () => {
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 1000)
  });
  document.body.append(a);
  a.click();
}

async function share(type) {
  if (type == "topTracks") {
    html2canvas(document.querySelector("#topTracksList"), {
        useCORS: true,
        allowTaint: true
    }).then(async (canvas) => {
        var ctx = canvas.getContext('2d');

        ctx.font = "14px Arial";
        ctx.fillStyle = "aliceblue";
        ctx.textAlign = "center";
        ctx.fillText("thetrackify.vercel.app", canvas.width + 385, canvas.height + 55);

        //document.body.appendChild(canvas)
        dataUrl = canvas.toDataURL();
        const blob = await fetch(dataUrl).then(res => res.blob());
        await shareOrDownload(blob, "toptracks.png");           
        });
  }
  else if (type == "topArtists") {
    html2canvas(document.querySelector("#topArtistsList"), {
        useCORS: true,
        taintTest: false,
        allowTaint: false
    }).then(async (canvas) => {
        var ctx = canvas.getContext('2d');

        ctx.font = "14px Arial";
        ctx.fillStyle = "aliceblue";
        ctx.textAlign = "center";
        ctx.fillText("thetrackify.vercel.app", canvas.width + 500, canvas.height + 1);

        //document.body.appendChild(canvas)
        dataUrl = canvas.toDataURL();
        const blob = await (await fetch(dataUrl)).blob();
        shareOrDownload(blob, "topartists.png");           
    });
  }
}