module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // ...any existing plugins stay above this line
      "react-native-reanimated/plugin",
    ],
  };
};