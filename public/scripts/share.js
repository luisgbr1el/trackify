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

async function share(divId, filename) {
    html2canvas(document.querySelector(`#${divId}`), {
        useCORS: true,
        taintTest: false,
        allowTaint: false,
        backgroundColor: "#F0F8FF"
    }).then(async (canvas) => {

        //document.body.appendChild(canvas)
        dataUrl = canvas.toDataURL();
        const blob = await fetch(dataUrl).then(res => res.blob());
        await shareOrDownload(blob, `${filename}.png`);           
        });
}
