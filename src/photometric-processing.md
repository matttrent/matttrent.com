---
title: Photometric Image Processing for HDR Displays
layout: page.hbs
---

<span class='figure'>
<img src="http://matttrent.s3.amazonaws.com/heroku/attachments/research/photometric-processing-1.png" alt="" width="32%" /> <img src="http://matttrent.s3.amazonaws.com/heroku/attachments/research/photometric-processing-2.png" alt="" width="32%" /> <img src="http://matttrent.s3.amazonaws.com/heroku/attachments/research/photometric-processing-3.png" alt="" width="32%" /> <label for="mn-demo" class="margin-toggle">&#8853;</label><input type="checkbox" id="mn-demo" class="margin-toggle"/><span class="marginnote">
  Left: original HDR image, tone mapped for display.  Center: high contrast, low frequency image representing the LED backlight.  Right: LCD image corresponding to backlight.  The combination of the backlight and LCD image will reconstruct the original image. 
</span>
</span>

Many real-world scenes contain a dynamic range that exceeds conventional
display technology by several orders of magnitude.  Through the combination of
several existing technologies, new high dynamic range displays, capable of
reproducing a range of intensities much closer to that of real environments,
have been constructed.  These benefits come at the cost of more optically
complex devices; involving two image modulators, controlled in unison, to
display images.  We present several methods of rendering images to this new
class of devices for reproducing photometrically accurate images.  We discuss
the process of calibrating a display, matching the response of the device with
our ideal model.  We then derive series of methods for efficiently displaying
images, optimized for different criteria and evaluate them in a perceptual
framework.

## Publications

- [M.Sc. dissertation][MSc]
- [Photometric Image Processing for HDR Displays][JVCI]
- [HDR Techniques in Graphics: from Acquisition to Display][EG2005] ([notes][EG2005 notes])
- [HDR Display Systems][HDRDisplay]

[MSc]:          /attachments/research/papers/MscThesis.pdf
[JVCI]:         http://dx.doi.org/10.1016/j.jvcir.2007.06.006
[EG2005]:       http://isg.cs.tcd.ie/eg2005/T7.html
[EG2005 notes]: /attachments/research/talks/EG.2005-HdrCourseNotes.pdf
[HDRDisplay]:   http://www.cs.ubc.ca/labs/imager/tr/2004/Seetzen_2004_HDR

## Presentation

<span class='figure'>
<script async class="speakerdeck-embed" data-id="01d5c3500d16013084d21231381d9bd4" data-ratio="1.29456384323641" src="//speakerdeck.com/assets/embed.js"></script>
</span>
