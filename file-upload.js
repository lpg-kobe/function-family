/**
 * @desc 文件上传组件
 * @return {Object}
 * @author lpg
 */

!(function (window, undefined) {
    var f = {};
    f.createUpload = function (options) {
        var uploadArea = options.uploadArea
    };
    f.previewFile = function (options) {
        var reader = new FileReader();
    };

    window.file = f;
})(window)