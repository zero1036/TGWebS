({
    //appDir: "./",
    //baseUrl: "../main",
    //dir: "../build",
    name: "../main/main1",
    optimize: "uglify",
    out: "../build/main-built.js",
    paths: {
        a: '../main/a',
        b: '../main/b',
        c: '../main/c'
    },
    shim: {
        a: {
            exports: 'a'
        },
        b: {
            deps: ['a']
        },
        c: {
            deps: ['b']
        }
    },
})