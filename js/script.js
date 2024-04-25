var imgData = '';

document.getElementById('inputFile').addEventListener('change', function(event) {
  var file = event.target.files[0]; // 取得選擇的檔案
  var reader = new FileReader();

  reader.onload = function(e) {
    var img = new Image();
    img.src = e.target.result; // 設定圖片來源
    img.onload = function() {
    var canvas = document.getElementById('art');
    var ctx = canvas.getContext('2d');

    // 設定canvas寬高為原始圖片的寬高
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除canvas上的內容
    ctx.drawImage(img, 0, 0); // 在canvas上繪製原始圖片

    imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    };
  };

  reader.readAsDataURL(file); // 讀取檔案
});

document.getElementById('uploadText').addEventListener('click', function() {
  var canvas = document.getElementById('art');
  var ctx = canvas.getContext('2d');
  var text = document.getElementById('watermarkText').value;
  var color = document.getElementById('colorpicker').value;
  var fontSize = parseInt(document.getElementById('fontSize').value);
  var spacing = parseInt(document.getElementById('spacing').value);
  var opacity = parseFloat(document.getElementById('opacity').value);
  var rotation = parseInt(document.getElementById('rotation').value);

  if (text.trim() !== '') {
    // 清除整個 canvas 上的內容
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 重繪原始圖片
    ctx.putImageData(imgData, 0, 0);

    ctx.font = 'bold ' + fontSize + 'px Arial'; // 設定文字大小和字型為粗體
    ctx.fillStyle = color; // 設定文字顏色
    ctx.globalAlpha = opacity * 0.01; // 設定文字透明度

    // 獲取 canvas 的寬高
    var canvasWidth = canvas.width * 2;
    var canvasHeight = canvas.height * 2;

    // 設定旋轉中心點的座標為 canvas 的中心
    var centerX = canvas.width * 0.0005 * spacing;
    var centerY = canvas.height * 0.0005 * spacing;

    // 使用迴圈生成多個浮水印文字
    for (var i = 0; i < Math.ceil(canvasHeight / (fontSize + spacing)); i++) {
      for (var j = 0; j < Math.ceil(canvasWidth / (ctx.measureText(text).width + spacing)); j++) {
        // 儲存當前的繪圖狀態
        ctx.save();
        
        // 移動 canvas 的原點到旋轉中心點
        ctx.translate(j * (ctx.measureText(text).width + spacing) + centerX, i * (fontSize + spacing) + centerY);
        
        // 設定旋轉角度為 45 度
        ctx.rotate(rotation * Math.PI / 180);
        
        // 繪製文字
        ctx.fillText(text, -ctx.measureText(text).width / 2, fontSize / 2);
        
        // 恢復之前的繪圖狀態，取消旋轉
        ctx.restore();
      }
    }
  }
});

document.getElementById('saveCanvas').addEventListener('click', function() {
  var canvas = document.getElementById('art');
  var url = canvas.toDataURL(); // 將 canvas 轉換為 data URL
  var a = document.createElement('a');
  a.href = url;
  a.download = 'example.png'; // 設定下載的檔案名稱
  a.click(); // 模擬點擊
});