{
  "targets": [
    {
      "target_name": "murmur3",
      "sources": [
        "src/murmur3.cc",
        "src/module.cc"
      ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
      ]
    },
    {
      "target_name": "action_after_build",
      "type": "none",
      "dependencies": [
        "murmur3"
      ],
      "copies": [
        {
          "files": [ "<(PRODUCT_DIR)/murmur3.node" ],
          "destination": "lib"
        }
      ]
    }
  ]
}
