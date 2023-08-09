# CSV-Converter

## index.js

- fs.readdir(inputdirectory, (err, files) => {...})

  - input_csv 폴더 파일 목록을 읽은 후에 콜백 함수 내에서 파일 변환 작업 시작
    <br/>

- const totalFiles = files.length

  - 총 변환할 파일 수
    <br/>

- let convertedFiles = 0

  - 현재 변환된 파일 수를 추적하는 변수
    <br/>

- const inputFilePath = path.join(inputDirectory, file)

  - 입력 파일 경로 생성
    <br/>

- const outputFilePath = path.join(outputDirectory, file)
  - 출력 파일 경로를 생성

<br/>
<hr/>

## csvConverter.js

- converStream
  - Node.js의 'stream.Transform'을 이용하여 데이터 변환. 스트림을 통해 데이터를 변환하고, 변환된 데이터를 출력 스트림에 전달
  - chunk: 스트림을 통해 전달된 데이터 조각으로 이 경우에는 바이너리 데이터
  - encoding: 데이터 조각의 인코딩 형식을 나타내는 문자열. 바이너리 데이터를 다루므로 'null'
  - callback
  - const convertedChunk = iconv.decode(chunk, detectedEncoding) : iconv.decode() 함수를 사용하여 'chunk'데이터를 'detectedEncoding'으로 디코딩하여 UTF-8로 변환
  - convertedBytes += convertedChunk.length : 현재 변환된 데이터의 길이를 더해줌으로 변환된 데이터의 바이트 수를 계산
  - this.push(convertedChunk): 다음 스트림으로 데이터가 흐를 수 있게 변환된 데이터를 출력 스트림에게 전달

<br/>

- readStream.pipe(convertStream).pipe(lineTransform).pipe(writeStream)
  - readStream.pipe(convertStream): 읽기 스트림(readStream)에서 읽은 데이터를 변환 스트림(convertStream)으로 연결하여 데이터 변환
  - .pipe(lineTransform): 변환 스트림(convertStream)에서 나온 데이터를 또 다른 변환 스트림(lineTransform)으로 연결. 이 스트림은 각 줄의 날짜 형식을 수정하는 작업을 수행
  - .pipe(writeStream): 마지막 변환 스트림(lineTransform)에서 나온 데이터를 쓰기 스트림(writeStream)에 연결하여 변환된 데이터를 출력 파일에 쓰는 작업을 수행
