# GPU Image Mosaic
> A blazing fast Image Mosaic generator

![]()
## Internal working
It uses [GPU.js](gpu.rocks) to do the heavy lift of calculate and compare images, and Canvas API to encode and decode the images, so all the technologies are browser compatible, and JavaScript only moves data around 

## How fast
It doesn't have benchmarks, but it is obvious that in a browser environment, that only support JS ( maybe WASM too ) programming, the faster way to do it is putting the GPU to work. Now, running a program in your computer, with no limitations to JS, i am not sure how fast it compared to the alternatives, maybe with some optimization is faster, but how knows

## Use

> In NodeJS:

first install
``npm i gpu-image-mosaic``

then, you will need a "Piximage dir", this is a directory that has a image atlas, containing all the images that can be used, and a configuration file, that has the color approximation of the images inside the atlas

to generate this, use the command

`TODO`

this will create a Piximage directory

Now, for the create of the proper image mosaic, you will do the following

`TODO`

## Work To Do
- [ ] Do a browser Build
- [ ] Make the command line executable
- [ ] Make accessible as a module
- [ ] Clean up the code

##  Meta

João Carlos – [@João Carlos](https://www.linkedin.com/in/joão-carlos-a569a51b2) – jcarlos.paranhos@gmail.com
