/**
 * @desc 移动端兼容性视频解决方案=>android 并不能局域播放
 * @method 在video标签中添加 preload x5-video-player-type="h5" 
 * @method x5-video-player-fullscreen="portraint" playsinline="true"
 * @method webkit-playsinline="true" x-webkit-airplay="true"即可实现局域播放
 * @method 视频拉伸=>在点击播放时将video的div:position=absolute高度设为屏幕高度+object-fill:fill使视频铺满左右屏幕，video.height=auto,并将该div设为flex布局结合align-items:center将该视频居中显示
 * @method 视频封面=>使用一个div将背景图设为封面center no-repeat并结合backgroundSize=”cover”将封面等比例全屏
 * @method 安卓自动全屏=>检测ended事件将视频隐藏使其强制退出全屏，并结合x5videoexitfullscreen退出全屏事件显示隐藏的视频,video.paused事件可检测视频播放状态
 * @param {$video}:video元素{$playBtn}:播放按钮{$loadTxt}:视频加载元素
 * @return $videoObj={__proto__}
 * @author LPG
 */

!(function (window, undefined) {
    var v = {},
        isAndroid = navigator.userAgent.indexOf('Android') > -1;//platform for android
    v.loadToPlay = function ($video, $playBtn, $loadTxt, $videoPoster) {//load to play video
        $loadTxt.style.display = "block";
        $playBtn.style.display = "none";
        $videoPoster.style.display = "none";//播放收起封面
        $video.play();
        var timer = setInterval(function () {
            var currentTime = $video.currentTime;//当前播放时间
            if (currentTime > 0) {
                $loadTxt.style.display = "none";
                clearInterval(timer);
            }
        }, 100)
    };
    v.controllPlay = function ($video, $playBtn) {//controll play or pause for video
        $video.addEventListener("click", function (e) {
            e.stopPropagation();
            if ($video.paused) {
                $video.play();
                $playBtn.style.display = "none";
            } else {
                $video.pause();
                $playBtn.style.display = "block";
            }
        })
    };
    v.videoEnd = function ($video, $playBtn, $videoPoster) {//video end
        $video.addEventListener("ended", function () {
            $playBtn.style.display = "block";
            $videoPoster.style.display = "block";
            if (isAndroid) {//hide video to trigger x5videoexitfullscreen event
                $video.style.display = "none";
            };
        })
    };
    v.androidPlay = function ($video, $playBtn, $videoPoster) {//play event for android
        if (isAndroid) {
            $video.addEventListener('x5videoenterfullscreen', function () {
                $playBtn.style.display = "none";
                $videoPoster.style.display = "none";
            });
            $video.addEventListener('x5videoexitfullscreen', function () {
                $video.style.display = "block";
                $playBtn.style.display = "block";
                $videoPoster.style.display = "block";
            })
        }
    };
    window.$videoObj = v;
})(window)
