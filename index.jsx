import { MainAnimation } from "./animation";
import AnimationLoop from "simple_animation_loop";

setTimeout(() => {
  new MainAnimation({
    el: document.getElementById("world"),
    animationLoop: new AnimationLoop()
  }).init(new Array(5));
});
