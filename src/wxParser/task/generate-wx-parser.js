const fs = require('fs');

const wxParserSource = './src/wxParser/wx-parser-template.wxml';

const wxParserDest = './src/wxParser/wx-parser.wxml';

const wxParserBuild = () => {
  const rs = fs.createReadStream(wxParserSource);
  let content = '';

  rs.setEncoding('utf8');

  rs.on('data', (chunk) => {
    content += chunk;
  });

  const ws = fs.createWriteStream(wxParserDest);
  rs.on('close', () => {
    // import relative template
    ws.write('<import src="./wx-parser-other.wxml"/>');
    ws.write('\r\n');
    // generate 20 layers wx-parser
    for (let i = 0; i < 20; i += 1) {
      ws.write(`\r\n<!-- wx-parser-${i} -->\r\n`);
      const temp = content
        .replace(/wx-parser-x/, `wx-parser-${i}`)
        .replace(/wx-parser-y/g, `wx-parser-${i + 1}`);
      ws.write(temp);
    }
  });
};

wxParserBuild();
