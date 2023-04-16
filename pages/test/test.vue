<template>
	<view>
		<!-- pages/index/index.wxml -->
		 
		<view class='screen'>{{result}}</view>
		 
		<view class='test-bg'>
		  <view class='btnGroup'>
		    <view class='item green' @click='clickButton'  :id="C">AC</view>
		    <view class='item green' @click='clickButton' :id="back">←</view>
		    <view class='item green' @click='clickButton' :id="addSub">+/-</view>
		    <view class='item green' @click='clickButton' :id="div">÷</view>
		  </view>
		 
		  <view class='btnGroup'>
		    <view class='item blue' @click='clickButton' :id="id7">7</view>
		    <view class='item blue' @click='clickButton' :id="id8">8</view>
		    <view class='item blue' @click='clickButton' :id="id9">9</view>
		    <view class='item green' @click='clickButton' :id="mut">×</view>
		  </view>
		 
		  <view class='btnGroup'>
		    <view class='item blue' @click='clickButton' :id="id4">4</view>
		    <view class='item blue' @click='clickButton' :id="id5">5</view>
		    <view class='item blue' @click='clickButton' :id="id6">6</view>
		    <view class='item green' @click='clickButton' :id="sub">-</view>
		  </view>
		 
		  <view class='btnGroup'>
		    <view class='item blue' @click='clickButton' :id="id1">1</view>
		    <view class='item blue' @click='clickButton' :id="id2">2</view>
		    <view class='item blue' @click='clickButton' :id="id3">3</view>
		    <view class='item green' @click='clickButton' :id="add">+</view>
		  </view>
		 
		  <view class='btnGroup'>
		    <view class='item blue' @click='clickButton' :id="percent">%</view>
		    <view class='item blue' @click='clickButton' :id="id0">0</view>
		    <view class='item blue' @click='clickButton' :id="dot">.</view>
		    <view class='item green' @click='clickButton' :id="equ">=</view>
		  </view>
		 
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				back: 'back',
				    C: 'C',
				    addSub: 'addSub',
				    add: '+',
				    sub: '-',
				    mut: '×',
				    div: '÷',
				    equ: '=',
				    percent: '%',
				    dot: '.',
				    id0: '0',
				    id1: '1',
				    id2: '2',
				    id3: '3',
				    id4: '4',
				    id5: '5',
				    id6: '6',
				    id7: '7',
				    id8: '8',
				    id9: '9',
				    result: '0',
				    valiBackOfArray: ['+', '-', '×', '÷', '.'],
				    completeCalculate: false
			}
		},
		onShow() {
			 wx.hideHomeButton();
		},
		methods: {
			 // 计算结果
			  calculate: function (str) {
			    // 判断是不是有负数
			    var isNagativeNum = false;
			    if (str.charAt(0) == '-') {
			      str = str.replace('-', '').replace('(', '').replace(')', '');
			      isNagativeNum = true;
			    }
			    // 对字符串解析并运算
			    var addArray = str.split('+');
			    var sum = 0.0;
			    for (var i = 0; i < addArray.length; i++) {
			      if (addArray[i].indexOf('-') == -1) {
			        if (addArray[i].indexOf('×') != -1 || addArray[i].indexOf('÷') != -1)
			          sum += this.calculateMutDiv(addArray[i]);
			        else sum += Number(addArray[i]);
			      }
			      else {
			        var subArray = addArray[i].split('-');
			        var subSum = 0;
			        if (subArray[0].indexOf('×') != -1 || subArray[0].indexOf('÷') != -1) subSum = this.calculateMutDiv(subArray[0]);
			        else subSum = Number(subArray[0]);
			        for (var j = 1; j < subArray.length; j++) {
			          if (subArray[i].indexOf('×') != -1 || subArray[i].indexOf('÷') != -1)
			            subSum -= this.calculateMutDiv(subArray[j]);
			          else subSum -= Number(subArray[j]);
			        }
			        sum += subSum;
			      }
			    }
			    if (isNagativeNum) return (-sum).toString();
			    else return sum.toString();
			  },
			  // 分块乘除运算
			  calculateMutDiv: function (str) {
			    var addArray = str.split('×');
			    var sum = 1.0;
			    for (var i = 0; i < addArray.length; i++) {
			      if (addArray[i].indexOf('÷') == -1) {
			        sum *= Number(addArray[i]);
			      }
			      else {
			        var subArray = addArray[i].split('÷');
			        var subSum = Number(subArray[0]);
			        for (var j = 1; j < subArray.length; j++) {
			          subSum /= Number(subArray[j]);
			        }
			        sum *= subSum;
			      }
			    }
			    return sum;
			  },
			  // 是否以运算符结尾
			  isOperatorEnd: function (str) {
			    for (var i = 0; i < this.valiBackOfArray.length; i++) {
			      if (str.charAt(str.length - 1) == this.valiBackOfArray[i]) return true;
			    }
			    return false;
			  },
			  clickButton: function (event) {
			    if (this.result == 0) {
			      if (event.target.id == 'back' || event.target.id == 'C' || event.target.id == 'addSub' || event.target.id == '%' || event.target.id == '+' || event.target.id == '-' || event.target.id == '×' || event.target.id == '÷' || event.target.id == '=') return;
			      // this.setData({
			        this.result= event.target.id
			      // });
			    }
			    else if (event.target.id == 'back') {
			     
			        this.result= this.result.length == 1 ? '0' : this.result.substring(0, this.result.length - 1)
			     
			    }
			    else if (event.target.id == 'C') {
			      // this.setData({
			        this.result= '0'
			      // });
			    }
			    else if (event.target.id == 'addSub') {
			      var r = this.result;
			      if (this.isOperatorEnd(r)) return;
			      if (r.charAt(0) == '-') 
				  
					  this.result= r.replace('-', '').replace('(', '').replace(')', '') 
					 
			      else this.result= '-(' + r + ')'
				  // this.setData({
			      // });
			    }
			    else if (event.target.id == '%') {
			    }
			    else if (event.target.id == '=') {
			      if (this.isOperatorEnd(this.result)) return;
			      // this.setData({
			        this.result= this.calculate(this.result)
			      // });
			      // this.setData({
			        this.completeCalculate= true
			      // });
			    }
			    else {
			      if (this.isOperatorEnd(this.result) && this.isOperatorEnd(event.target.id)) return;
			      // 如果计算结果有小数点，直到输入运算符前不能再输入小数点
			      if (this.completeCalculate && this.result.indexOf('.') != -1 && event.target.id == '.') return;
			      for (var i = 0; i < this.valiBackOfArray.length - 1; i++) {
			        if (this.valiBackOfArray[i] == event.target.id) {
			          // this.setData({
			            this.completeCalculate= false
			          // });
			          break;
			        }
			      }
			      // this.setData({
			        this.result= this.result + event.target.id
			      // });
			    }
			}
		
			
		}
	}
</script>

<style>
/* pages/index/index.wxss */
page {
  width: 100%;
  height: 100%;
}
 
.test-bg {
  position: fixed;
  bottom: 0;
}
 
.screen {
  position: fixed;
  color: #000000;
  font-size: 30px;
  bottom: 780rpx;
  text-align: right;
  width: 730rpx;
  word-wrap: break-word;
}
 
.btnGroup {
  display: flex; /*弹性显示结构*/
  flex-direction: row;/*横向显示*/
}
 
.item {
  width: 192rpx;
  line-height: 148rpx;
  border-radius: 5%;
  text-align: center;
}
 
.green {
  /* 前景色 */
  color: #000000;
  border: solid 1rpx #ffffff;
  /* 背景色 */
  background: #CCFF99;
}
 
.blue {
  /* 前景色 */
  color: #000000;
  border: solid 1rpx #ffffff;
  /* 背景色 */
  background: #A7DFF1;
}
</style>
