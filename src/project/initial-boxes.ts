import {Box, BoxType, FrameBox, HtmlBox, TextBox} from '../boxes/box';

const titleBox: TextBox = {
  id: '1',
  height: 100,
  width: 300,
  x: 0,
  y: 0,
  layerId: null,
  type: BoxType.TEXT,
  scale: 1,
  rotate: 0,
  name: 'Title',
  data: {
    colorId: '3',
    align: 'left',
    fontSize: '24px',
    backgroundColorId: null,
    padding: '',
    style: 'normal',
    weight: 'bold',
    text: 'Welcome to Speech App!'
  }
};

const subtitleBox: TextBox = {
  id: '2',
  height: 100,
  width: 300,
  x: 0,
  y: 50,
  layerId: null,
  type: BoxType.TEXT,
  scale: 1,
  rotate: 0,
  name: 'Subtitle',
  data: {
    colorId: null,
    align: 'left',
    fontSize: '18px',
    backgroundColorId: null,
    padding: '',
    style: 'normal',
    weight: 'normal',
    text: 'This is empty workspace. You can edit it with sidebar on right.'
  }
};

const legendBox: HtmlBox = {
  id: '3',
  height: 500,
  width: 500,
  x: 100,
  y: 350,
  layerId: null,
  type: BoxType.HTML,
  scale: 1,
  rotate: 0,
  name: 'Legend',
  data: {
    html: `
<style>
    .init-box-icon {
        width: 45px;
    }
</style>
<div class="row mb-3 align-items-center">
    <div class="col-auto">
        <button class="init-box-icon btn btn-primary">
            <i class="fas fa-plus"></i>
        </button>
    </div>
    <div class="col">
        <strong>Use this one to add new content</strong>
    </div>
</div>
<div class="row mb-3 align-items-center">
    <div class="col-auto">
        <button class="init-box-icon btn btn-primary">
            <i class="fas fa-photo-video"></i>
        </button>
    </div>
    <div class="col">
        <strong>Use this one to manage existing content</strong>
    </div>
</div>
<div class="row mb-3 align-items-center">
    <div class="col-auto">
        <button class="init-box-icon btn btn-primary">
            <i class="fas fa-pencil-ruler"></i>
        </button>
    </div>
    <div class="col">
        <strong>Use this one to edit selected object</strong>
    </div>
</div>
<div class="row mb-3 align-items-center">
    <div class="col-auto">
        <button class="init-box-icon btn btn-primary">
            <i class="fas fa-layer-group"></i>
        </button>
    </div>
    <div class="col">
        <strong>Use this one to manage workspace layers</strong>
    </div>
</div>
<div class="row mb-3 align-items-center">
    <div class="col-auto">
        <button class="init-box-icon btn btn-primary">
            <i class="fas fa-stopwatch"></i>
        </button>
    </div>
    <div class="col">
        <strong>Use this one to add/remove keyframes of presentation</strong>
    </div>
</div>
<div class="row mb-3 align-items-center">
    <div class="col-auto">
        <button class="init-box-icon btn btn-primary">
            <i class="fas fa-file"></i>
        </button>
    </div>
    <div class="col">
        <strong>Use this one to edit project properties or manage colors</strong>
    </div>
</div>
    `
  }
};

const exploreBox: TextBox = {
  id: '5',
  height: 100,
  width: 300,
  x: 0,
  y: 500,
  layerId: null,
  type: BoxType.TEXT,
  scale: 1,
  rotate: 0,
  name: 'Explore',
  data: {
    colorId: null,
    align: 'left',
    fontSize: '18px',
    backgroundColorId: null,
    padding: '',
    style: 'normal',
    weight: 'normal',
    text: 'Have fun and explore rest of the features of Speech App.'
  }
};

const videoBox: FrameBox = {
  id: '4',
  name: 'Video',
  rotate: 0,
  scale: 1,
  y: 250,
  x: 800,
  layerId: null,
  width: 800,
  height: 600,
  type: BoxType.FRAME,
  data: {
    url: 'https://www.youtube.com/embed/8S0FDjFBj8o',
    attrs: [
      { name: 'allow', value: 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' }
    ]
  }
};

export const boxes: Array<Box> = [
  titleBox,
  subtitleBox,
  legendBox,
  videoBox,
  exploreBox
];
