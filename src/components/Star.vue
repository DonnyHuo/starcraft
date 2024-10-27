<template>
  <div class="star">
    <div v-if="props.isMining && !props.stopAni" :class="`keyframes ${props.nftName}`">
      <div class="cube cube--1">
        <div class="side side--back"><div class="side__inner"></div></div>
        <div class="side side--left"><div class="side__inner"></div></div>
        <div class="side side--right"><div class="side__inner"></div></div>
        <div class="side side--top"><div class="side__inner"></div></div>
        <div class="side side--bottom"><div class="side__inner"></div></div>
        <div class="side side--front"><div class="side__inner"></div></div>
      </div>
      <div class="cube cube--2">
        <div class="side side--back"><div class="side__inner"></div></div>
        <div class="side side--left"><div class="side__inner"></div></div>
        <div class="side side--right"><div class="side__inner"></div></div>
        <div class="side side--top"><div class="side__inner"></div></div>
        <div class="side side--bottom"><div class="side__inner"></div></div>
        <div class="side side--front"><div class="side__inner"></div></div>
      </div>
      <div class="cube cube--3">
        <div class="side side--back"><div class="side__inner"></div></div>
        <div class="side side--left"><div class="side__inner"></div></div>
        <div class="side side--right"><div class="side__inner"></div></div>
        <div class="side side--top"><div class="side__inner"></div></div>
        <div class="side side--bottom"><div class="side__inner"></div></div>
        <div class="side side--front"><div class="side__inner"></div></div>
      </div>
    </div>
    <img v-else class="star_img" :src="props.nftImage" alt="" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
// const classList = [
//   'Shakuras [1st]',
//   'Aiur [2nd]',
//   'Korhal [3rd]',
//   'Char [4th]',
//   'Tarsonis [5th]',
//   'Mar Sara [6th]',
//   'Kaldir [7th]'
// ];
const props = defineProps({
  isMining: {
    type: Boolean,
    default: false
  },
  stopAni: {
    type: Boolean,
    default: false
  },
  nftImage: {
    type: String,
    default: ''
  },
  nftName: {
    type: String,
    default: ''
  }
});

// watch(props, (newProps) => {
//   console.log(newProps);
// });
</script>
<style lang="scss" scoped>
.star {
  width: 100%;
  position: relative;
  margin-top: 100px;
}
.star_img {
  width: 200px;
  height: 200px;
  display: block;
  margin: 0 auto;
}
.star .keyframes {
  font-size: 16px;
  margin: 60px auto;
  width: 10em;
  height: 10em;
  transform-style: preserve-3d;
  -webkit-animation: rotate 18s linear infinite;
  animation: rotate 18s linear infinite;
}

.star .cube {
  position: absolute;
  width: 10em;
  height: 10em;
  transform-style: preserve-3d;
}

.star .cube--2 {
  transform: rotateX(45deg) rotateY(45deg);
}

.star .cube--3 {
  transform: rotateX(45deg) rotate(45deg);
}

.star .Shakuras .side {
  border: rgba(171, 43, 193, 0.4);
}

.star .Shakuras .side:after {
  color: #ab2bc1;
}

.star .Shakuras .side:before {
  color: #e88d9f;
}

.star .Shakuras .side > .side__inner {
  color: #fb6e63;
}

.star .Shakuras .side > .side__inner:before {
  color: #ffac81;
}

.star .Shakuras .side > .side__inner:after {
  color: #ffdda2;
}

.star .Aiur .side {
  border: 2px dotted rgba(255, 177, 0, 0.7);
}

.star .Aiur .side:after {
  color: #ce4e53;
}

.star .Aiur .side:before {
  color: #ad0056;
}

.star .Aiur .side > .side__inner {
  color: #f4545a;
}

.star .Aiur .side > .side__inner:before {
  color: #ffb100;
}

.star .Aiur .side > .side__inner:after {
  color: #feff00;
}

.star .Korhal .side {
  border: 2px dotted rgba(3, 196, 255, 0.7);
}

.star .Korhal .side:after {
  color: #7100d3;
}

.star .Korhal .side:before {
  color: #3a008f;
}

.star .Korhal .side > .side__inner {
  color: #ab13ff;
}

.star .Korhal .side > .side__inner:before {
  color: #03c4ff;
}

.star .Korhal .side > .side__inner:after {
  color: #f184ff;
}

.star .Char .side {
  border: 2px dotted rgba(10, 0, 174, 0.6);
}

.star .Char .side:after {
  color: #0a00ae;
}

.star .Char .side:before {
  color: #6023fa;
}

.star .Char .side > .side__inner {
  color: #142953;
}

.star .Char .side > .side__inner:before {
  color: #00aefd;
}

.star .Char .side > .side__inner:after {
  color: #00fff4;
}

.star .Kaldir .side {
  border: 2px dotted rgba(236, 22, 208, 0.4);
}

.star .Kaldir .side:after {
  color: #ec16d0;
}

.star .Kaldir .side:before {
  color: #24a5d7;
}

.star .Kaldir .side > .side__inner {
  color: #3d68d9;
}

.star .Kaldir .side > .side__inner:before {
  color: #724ce7;
}

.star .Kaldir .side > .side__inner:after {
  color: #78eaff;
}

.star .Mar .side {
  border: 2px dotted rgba(0, 255, 135, 0.45);
}

.star .Mar .side:after {
  color: #2e747e;
}

.star .Mar .side:before {
  color: #00ff87;
}

.star .Mar .side > .side__inner {
  color: #50eb9c;
}

.star .Mar .side > .side__inner:before {
  color: #91ff63;
}

.star .Mar .side > .side__inner:after {
  color: #d9ffc3;
}

.star .Tarsonis {
  border: 2px dotted rgba(255, 159, 0, 0.5);
}

.star .Tarsonis .side:after {
  color: #ff9f00;
}

.star .Tarsonis .side:before {
  color: #af2b50;
}

.star .Tarsonis .side > .side__inner {
  color: #f46620;
}

.star .Tarsonis .side > .side__inner:after {
  color: #feff24;
}

.star .Tarsonis .side > .side__inner:before {
  color: #ffbd00;
}

.star .side {
  position: absolute;
  width: 10em;
  height: 10em;
  border-radius: 50%;
  transform-style: preserve-3d;
  transform: rotateY(180deg);
}

.star .side:after,
.star .side:before {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  margin: auto;
  box-sizing: border-box;
  border-radius: inherit;
  border: 1px solid;
  box-shadow: inset 0 0 2em, 0 0 2em;
}

.star .side:after {
  width: 1.5em;
  height: 1.5em;
  transform: translateZ(-2em);
  box-shadow: inset 0 0 1em, 0 0 1em;
}

.star .side:before {
  width: 2.5em;
  height: 2.5em;
}

.star .side > .side__inner {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  width: 5em;
  height: 5em;
  margin: auto;
  border-radius: inherit;
  border: 1px solid;
  box-shadow: inset 0 0 2em;
  transform: translateZ(2em);
  transform-style: preserve-3d;
}

.star .side > .side__inner:after,
.star .side > .side__inner:before {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  margin: auto;
  box-sizing: border-box;
  border-radius: inherit;
  border: 1px solid;
  box-shadow: inset 0 0 2em, 0 0 2em;
}

.star .side > .side__inner:before {
  width: 1.5em;
  height: 1.5em;
  display: none;
  transform: translateZ(3em);
}

.star .side > .side__inner:after {
  width: 1em;
  height: 1em;
  transform: translateZ(10em);
}

.star .side--back {
  transform: translateZ(-5em) rotateY(180deg);
}

.star .side--left {
  transform: translateX(-5em) rotateY(-90deg);
}

.star .side--right {
  transform: translateX(5em) rotateY(90deg);
}

.star .side--top {
  transform: translateY(-5em) rotateX(90deg);
}

.star .side--bottom {
  transform: translateY(5em) rotateX(-90deg);
}

.star .side--front {
  transform: translateZ(5em);
}

@-webkit-keyframes rotate {
  to {
    transform: rotateX(1turn) rotateY(2turn) rotate(1turn);
  }
}

@keyframes rotate {
  to {
    transform: rotateX(1turn) rotateY(2turn) rotate(1turn);
  }
}

.time {
  position: relative;
  left: 50%;
  width: 100px;
  display: flex;
  align-items: flex-start;
}

.time span {
  font-size: 12px;
  font-family: HelloFont-WenYiHei, HelloFont;
  font-weight: 400;
  color: #fff;
  line-height: 15px;
  margin-left: 4px;
}

.timed {
  width: 260px;
  background: rgba(189, 223, 255, 0.2);
  font-family: HelloFont-WenYiHei, HelloFont;
  font-weight: 400;
  border-radius: 8px;
  margin: 6px auto;
  padding: 8px 0;
}

.timed p {
  white-space: nowrap;
  font-size: 12px;
  color: hsla(0, 0%, 100%, 0.6);
  transform: scale(0.85);
  position: relative;
  left: -3px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0;
}

.timed p .btn {
  padding: 0 5px;
  height: 20px;
  background: rgba(42, 48, 66, 0.3);
  box-shadow: inset 0 0 80px 0 rgba(77, 120, 255, 0.5);
  border-radius: 4px;
  border: 1px solid #fff;
  font-size: 12px;
}

.timed div {
  font-size: 12px;
  color: #fff;
  position: relative;
  left: 6px;
}

.Navigation {
  margin-top: 40px;
  display: flex;
  text-align: center;
  justify-content: center;
  position: relative;
}

.Navigation > div {
  margin: 0 16px;
}

.Navigation p {
  font-size: 10px;
  font-family: HelloFont-WenYiHei, HelloFont;
  font-weight: 400;
  color: #a9cbf0;
  line-height: 13px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 0;
}

.Navigation p .loading {
  width: 12px;
  height: 12px;
  border-color: #a9cbf0;
}

.Navigation .profit {
  display: flex;
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
}

.Navigation .profit div {
  font-size: 10px;
  font-family: HelloFont-WenYiHei, HelloFont;
  font-weight: 400;
  color: #fff;
  line-height: 13px;
}
</style>
