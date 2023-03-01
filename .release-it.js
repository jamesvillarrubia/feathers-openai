module.export = {
  "git":{
    "requireCleanWorkingDir": false,
  },
  "github": {
    "release": true
  },
  "npm": {
    "ignoreVersion": true
  },
  "plugins": {
    "@release-it/conventional-changelog": {
      "preset": {
        "name": "conventionalcommits",
        "types": [
          {
            "type": "refactor",
            "release": "patch"
          },
          {
            "type": "style",
            "release": "patch"
          },
          {
            "type": "perf",
            "release": "patch"
          },
          {
            "type": "chore",
            "release": "patch"
          },
          {
            "type": "ci",
            "release": "minor"
          }
        ],
        "whatBump": ()=>{
          return null
          // null
        }
      }
    }
  }
}
