import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { NFTStorage } from 'nft.storage';
import { filesFromPaths } from 'files-from-path';

// https://dash.cloudflare.com/api/v4/zones/{zone_identifier}/web3/hostnames
// https://api.cloudflare.com/client/v4/zones/{zone_identifier}/web3/hostnames/{identifier}
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDI2RmRFNERDYTM1MjY0QWNhOUYzMWYwNjBDMGQyMWIwNUU2RDA3RDgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4Mzc5MjQ0Nzg1MSwibmFtZSI6Illhbmd4In0.1p9rmfQko4_xGH3StFEjSBIfyka1_tn0guoo60GQmaQ'; // NFT.Storage API Token
const zone_identifier = '0cae79074380d0da1b17097c652a42f0'; // 区域 ID
const authorization = 'Bearer Oxsv_5Q4fnj_SMAsrw3f8FRhUxrhKEmzwBHcq3Pn'; // 编辑区域 DNS => 区域.Web3 主机名
const domainList = [
  { env: 'main', id: '13c66aaedb524dc79c0d7d7c19ef9c9d', name: 'starcraft.vip' },
  { env: 'test-main', id: '48910b2e38d8409fb86ccea34d709ba9', name: 'test-main.starcraft.vip' },
  { env: 'test', id: '13b4265664e24d89b82c8eaf95267a88', name: 'test.starcraft.vip' }
];
const domainId = '3abca5b3908f49c68459ef8b5d184174'; // version.starcraft.vip

async function uploadDirectory() {
  const env = process.argv[2]; // 当前环境
  const directoryPath = './dist'; // 上传文件夹

  const files = await filesFromPaths([directoryPath], {
    recursive: true,
    pathPrefix: path.resolve(directoryPath),
    hidden: true
  });

  console.log('开始上传：', directoryPath);
  const storage = new NFTStorage({ token });
  const cid = await storage.storeDirectory(files);
  console.log('上传成功：', cid);

  const domainInfo = domainList.find((element) => element.env == env);
  console.log('开始部署：', domainInfo.name);
  const response = await axios.patch(
    `https://api.cloudflare.com/client/v4/zones/${zone_identifier}/web3/hostnames/${domainInfo.id}`,
    { dnslink: `/ipfs/${cid}` },
    { headers: { 'Content-Type': 'application/json', Authorization: authorization } }
  );
  if (response.data.success) {
    console.log('部署成功！');
    if (env === 'main') {
      uploadIpfsVersion(cid);
    }
  } else {
    console.log('部署失败：', response.data.errors);
  }
}
async function uploadIpfsVersion(cid) {
  const directoryPath = './ipfsVersion'; // 上传文件夹

  const ipfsInfoFilePath = path.resolve(directoryPath + '/ipfsVersion.json');
  const existingData = fs.readFileSync(ipfsInfoFilePath, 'utf-8');
  const ipfsInfoData = JSON.parse(existingData);
  console.log('读取：', ipfsInfoFilePath);

  const packageJsonPath = path.resolve('package.json');
  const packageJsonData = fs.readFileSync(packageJsonPath, 'utf-8');
  const version = JSON.parse(packageJsonData).version;

  const newIpfsInfo = { version, cid };
  if (ipfsInfoData[0].version == version) {
    console.log('更新旧版本：', version);
    ipfsInfoData[0].cid = cid;
  } else {
    console.log('新增版本：', version);
    ipfsInfoData.unshift(newIpfsInfo);
  }

  fs.writeFileSync(ipfsInfoFilePath, JSON.stringify(ipfsInfoData, null, 2));
  console.log('更新成功：');
  console.table(ipfsInfoData);

  const files2 = await filesFromPaths([directoryPath], {
    recursive: true,
    pathPrefix: path.resolve(directoryPath),
    hidden: true
  });

  console.log('开始上传：', directoryPath);
  const storage2 = new NFTStorage({ token });
  const cid2 = await storage2.storeDirectory(files2);
  console.log('上传成功：', cid2);

  console.log('开始部署：', 'version.starcraft.vip');
  const response2 = await axios.patch(
    `https://api.cloudflare.com/client/v4/zones/${zone_identifier}/web3/hostnames/${domainId}`,
    { dnslink: `/ipfs/${cid2}` },
    { headers: { 'Content-Type': 'application/json', Authorization: authorization } }
  );
  if (response2.data.success) {
    console.log('部署成功！');
  } else {
    console.log('部署失败：', response2.data.errors);
  }
}

// uploadDirectory();
// node storeDirectory.mjs test
// npm run build:dev
