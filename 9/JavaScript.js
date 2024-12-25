const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const captureButton = document.getElementById("capture");
const measurementDisplay = document.getElementById("measurement");

// Камераны иштетүү
navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((err) => {
    console.error("Камераны иштетүүдө ката:", err);
  });

// Пикселден сантиметрге калибрлөөнү камсыз кылуу (колдонуучунун эталондук объектинин узундугун киргизүүсү керек)
const pixelsPerCm = 37; // Бул маанини колдонуучу калибрлей алат

// Дубалдын өлчөмүн аныктоо
captureButton.addEventListener("click", () => {
  const context = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Сүрөттөн объекттин узундугун киргизүү үчүн колдонуучу (UI аркылуу)
  const objectWidthInPixels = prompt(
    "Сүрөттөн объекттин узундугун пикселде киргизиңиз:"
  );

  if (objectWidthInPixels) {
    const objectWidthInCm = objectWidthInPixels / pixelsPerCm;
    measurementDisplay.textContent = `Объекттин узундугу: ${objectWidthInCm.toFixed(
      2
    )} см`;
  } else {
    measurementDisplay.textContent = "Объекттин өлчөмү киргизилген жок.";
  }
});
