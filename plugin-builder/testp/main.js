registryEventListener("AppInit", function (e) {
    logger.info("Plugin", "\u7535\u73a9\u5c0f\u5b50\u63d2\u4ef6\u52a0\u8f7d\u6210\u529f");
});

registryEventListener("AppExit", function (e) {
    logger.info("Plugin", "App\u9000\u51fa, \u7535\u73a9\u5c0f\u5b50\u63d2\u4ef6\u5df2\u505c\u6b62");
});