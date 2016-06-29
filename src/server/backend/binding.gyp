{
  "targets": [
    {
      "target_name": "dmx_addon",
      "cflags": [
        "-Wall",
        "-std=c++11",
        "-libstdc++",
        "-lpthread",
        "-ldl",
        "-lrt"
      ],
      "sources": [
        "pro_driver.cc",
        "patch.cc",
        "fx.cc",
        "./lib/easing.c",
        "dmx.cc",
        "dmx_node.cc"
      ],
      "libraries": [
        "/home/majori/Projects/moonlight/src/server/backend/lib/libftd2xx.a"
      ]
    }
  ]
}
