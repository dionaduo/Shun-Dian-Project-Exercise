// 测试不同的签名规则
import md5 from "md5";

console.log('=== 测试不同的签名规则 ===');
const loginData = {
    appType: '0',
    deviceToken: '0',
    mobile: '19572988963',
    verificationCode: '438268',
    timestamp: '1772503957891',
};

// 规则1：按参数名排序后拼接值
const sortedKeys = Object.keys(loginData).sort();
let str1 = '';
sortedKeys.forEach(key => {
    str1 += loginData[key];
});
str1 += 'md5Key';
const sign1 = md5(str1);
console.log('规则1 (排序后拼接值):', str1);
console.log('规则1 签名:', sign1);

// 规则2：按固定顺序拼接值 (appType, deviceToken, mobile, verificationCode, timestamp)
let str2 = loginData.appType + loginData.deviceToken + loginData.mobile + loginData.verificationCode + loginData.timestamp + 'md5Key';
const sign2 = md5(str2);
console.log('规则2 (固定顺序):', str2);
console.log('规则2 签名:', sign2);

// 规则3：按参数名排序后拼接 key=value
let str3 = '';
sortedKeys.forEach(key => {
    str3 += `${key}=${loginData[key]}`;
});
str3 += 'md5Key';
const sign3 = md5(str3);
console.log('规则3 (排序后拼接key=value):', str3);
console.log('规则3 签名:', sign3);

// 规则4：只拼接部分参数
let str4 = loginData.mobile + loginData.verificationCode + loginData.timestamp + 'md5Key';
const sign4 = md5(str4);
console.log('规则4 (只拼接mobile+verificationCode+timestamp):', str4);
console.log('规则4 签名:', sign4);
