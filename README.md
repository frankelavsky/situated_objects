## Situated objects

This is student project, so really not worth looking at. [The model I threw together that is behind this project is here](https://teachablemachine.withgoogle.com/models/fI__QaIYR/).

But that being said, if you care to actually check this project out: this is a browser extension that loads a model up and does cool stuff. But it is an extension specific to chrome (so you'll need to download it/clone it) and then go into google chrome's extensions (chrome://extensions), enable dev mode, and then "load unpacked" extension. Once loaded, head over to wikipedia to try it out.

Fair warning: it really only works with lemons, large orange balls, a roll of electrical tape, a small fake potted plant, and a large red clip (for closing bags of potato chips or cereal). You'll need at least one of these items and pretty ideal camera conditions for this to work at all.

However, you **do not need to build this** locally in order for it to work. The "app" folder contains the ready-to-go bundled js file, so just load the root folder for this project into chrome's extensions.

I'll eventually get a blog post written up for this, so the demo video and images will be much more explanatory.

Essentially I trained 3 models over at google's [teachable machine](https://teachablemachine.withgoogle.com/) and then loaded the best one into a browser extension. I fiddled around with javascript so that a screen reader user (or anyone using a keyboard) can assign locations on a webpage to one of the random objects. Then you can travel back to previously "saved" locations by bringing the object back into view. This requires a camera with a pretty clean background.
