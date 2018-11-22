let Animation;

// Use an anonymous closure to keep the AnimationManager private
(() => {

  // From here: gist.github.com/gre/1650294
  const easingFunctions = {
    LINEAR         : t => t,
    EASEINQUAD     : t => t ** 2,
    EASEOUTQUAD    : t => t * (2 - t),
    EASEINOUTQUAD  : t => t < .5 ? 2 * t ** 2 : -1 + (4 - 2 * t) * t,
    EASEINCUBIC    : t => t ** 3,
    EASEOUTCUBIC   : t => --t ** 3 + 1,
    EASEINOUTCUBIC : t => t < .5 ? 4 * t ** 3 : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    EASEINQUART    : t => t ** 4,
    EASEOUTQUART   : t => 1 - --t ** 4,
    EASEINOUTQUART : t => t < .5 ? 8 * t ** 4 : 1 - 8 * --t ** 4,
    EASEINQUINT    : t => t ** 5,
    EASEOUTQUINT   : t => 1 + --t ** 5,
    EASEINOUTQUINT : t => t < .5 ? 16 * t ** 5 : 1 + 16 * --t ** 5
  }

  function lerp(start, end, ratio) {
    return start + (end - start) * ratio;
  }

  class AnimationManager {

    constructor() {
      this.activeAnimations = [];
      this.update = this.update.bind(this); // Make sure 'this' is correct when invoked by requestAnimationFrame
      this.update();
    }

    update() {
      for (const anim of this.activeAnimations)
        anim.update();
      this.activeAnimations = this.activeAnimations.filter(anim => !anim.complete);
      requestAnimationFrame(this.update);
    }

    registerAnimation(anim) {
      this.activeAnimations.push(anim);
    }

  }

  const animationManager = new AnimationManager();

  Animation = class {

    constructor(startingValues, endingValues, duration, updateCallback, finishedCallback, easing = 'EASE_IN_OUT_QUART') {

      /*
       * Normalize the easing function name such that all of the following are valid:
       * "EASEINOUTCUBIC"
       * "EASE_IN_OUT_CUBIC"
       * "ease in out cubic"
       * Case insensitive, optionally allowing spaces or underscores
       */
      easing = easing.toUpperCase().replace(/[^A-Z]/g, '');

      this.easingFunction = easingFunctions[easing];
      this.duration = duration;
      this.startingValues = startingValues;
      this.endingValues = endingValues;
      this.values = Object.assign({}, this.startingValues);
      this.startTime = performance.now();
      this.complete = false;
      this.updateCallback = updateCallback;
      this.finishedCallback = finishedCallback;

      // Register this animation so that it gets updated periodically
      animationManager.registerAnimation(this);
    }

    update() {
      if (this.complete) return;
      const now = performance.now();
      const elapsed = now - this.startTime;
      let completionRatio = elapsed / this.duration;
      this.complete = completionRatio >= 1;
      completionRatio = Math.min(1, this.easingFunction(completionRatio));
      for (const val in this.values)
        this.values[val] = lerp(this.startingValues[val], this.endingValues[val], completionRatio);
      this.updateCallback(this.values);
      if (this.complete)
        this.finishedCallback(this.endingValues);
    }

    skip() {
      this.complete = true;
      this.updateCallback(this.endingValues);
      this.finishedCallback(this.endingValues);
    }

  }

})();