---
title: Manipulating Scale-Dependent Perception of Images
layout: page.hbs
---

<figure>
  <img src="{{ site.attachments_prefix }}/research/chuckclose_full.png" alt="" width="35.5%"/> <img src="{{ site.attachments_prefix }}/research/chuckclose_crop.png" alt="" width="61.5%"/>{{#marginnote "caption"}}
    Self-portrait of Chuck Close viewed at 2 scales.  The left image is clearly recognizable as a portrait, even thought it contains the same diamond-shaped artifacts as the right.  However, without having first seen the left, the right image is difficult to distinguish as an eye and glasses.  Changing the scale (in this case zooming in) shifts the dominant interpretation from a portrait in the left image to artifacts in the right image.
{{/marginnote}}
</figure>

The purpose of most images is to effectively convey information. Implicit in this assumption is the fact that the recipient of that information is a human observer, with a visual system responsible for converting raw sensory inputs into the perceived appearance. The appearance of an image not only depends on the image itself, but the conditions under which it is viewed as well as the response of human visual system to those inputs. 

This thesis examines the scale-dependent nature of image appearance, where the same stimulus can appear different when viewed at varying scales, that arises from the mechanisms responsible for processing spatial vision in the brain. In particular, this work investigates changes in the perception of blur and contrast resulting from the image being represented by different portions of the viewer’s visual system due to changes in image scale. 

These methods take inspiration from the fundamental organization of spatial image perception into multiple parallel channels for processing visual information and employ models of human spatial vision to more accurately control the appearance of images under changing view- ing conditions. The result is a series of methods for understanding the blur and contrast present in images and manipulating the appearance of those qualities in a perceptually-meaningful way.

## Publications

- [Ph.D. dissertation][PhD]
- [Unsharp Masking, Countershading and Halos: Enhancements or Artifacts?][USM]
- [Blur-Aware Image Downsizing][BAD]
- [Defocus Techniques for Camera Dynamic Range Expansion][DRE]

[PhD]:  {{ site.attachments_prefix }}/research/papers/PhdThesis.pdf
[USM]:  http://www.cs.ubc.ca/labs/imager/tr/2012/Countershading/
[BAD]:  http://www.cs.ubc.ca/labs/imager/tr/2011/BlurAwareDownsize/
[DRE]:  {{ site.attachments_prefix }}/research/papers/ElectronicImaging.2010-Defocus.pdf

## Presentation

<figure style='padding-top: 40px;'>
<script async class="speakerdeck-embed" data-id="506608c6e64bdf000201ebf3" data-ratio="1.33333333333333" src="//speakerdeck.com/assets/embed.js"></script>
</figure>
