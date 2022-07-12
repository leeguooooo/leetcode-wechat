const {
  Contact,
  log,
  Message,
  ScanStatus,
  WechatyBuilder,
  UrlLink,
  MiniProgram,
  MessageType,
} = require('wechaty')

const {PuppetXp} = require('wechaty-puppet-xp')

const {FileBox} = require('file-box')
const {
  yesterdayData,
  getLeetcodeData,
  getACQuestionsMsg,
  todayData,
} = require('./getLeetcodeData')

const {leetcodeSchedule} = require('./time')

const name = 'wechaty-puppet-xp'
const puppet = new PuppetXp()

const bot = WechatyBuilder.build({
  name,
  puppet,
})

const MEMBER_NAME_LEETCODE = {
  辻弍: 'di-san-ren-cheng-xc',
  luxiao: 'xiao-lu-boss',
  Panda: 'pang-pang-hu-lu-lu',
  Lisa: 'xiao-shuang-5',
  郭立: 'leeguoo',
}

const LEETCODE_NAME_SLUG = {
  'di-san-ren-cheng-xc': '辻弍',
  'xiao-lu-boss': 'luxiao',
  'pang-pang-hu-lu-lu': 'Panda',
  'xiao-shuang-5': 'Lisa',
  leeguoo: '郭立',
}

async function onMessage(message) {
  console.log(`RECV: ${message}`)
  const talker = message.talker()
  const to = message.to()
  const type = message.type()
  const text = message.text()
  let messageType = ''
  let textBox = ''
  try {
    if (type === bot.Message.Type.Unknown) {
      messageType = 'Unknown'
      textBox = '未知的消息类型'
    }
    if (type === bot.Message.Type.Attachment) {
      messageType = 'Attachment'
      let file = await message.toFileBox()
      const base64 = await file.toBase64()
      textBox = FileBox.fromBase64(base64, file.name)
    }
    if (type === bot.Message.Type.Audio) {
      messageType = 'Audio'
      let file = await message.toFileBox()
      const base64 = await file.toBase64()
      textBox = FileBox.fromBase64(base64, file.name)
    }
    if (type === bot.Message.Type.Contact) {
      messageType = 'Contact'
      // textBox = await message.toContact()
      textBox = '联系人'
    }
    if (type === bot.Message.Type.Emoticon) {
      messageType = 'Emoticon'
      let file = await message.toFileBox()
      const base64 = await file.toBase64()
      textBox = FileBox.fromBase64(base64, file.name)
    }
    if (type === bot.Message.Type.Image) {
      messageType = 'Image'
      const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
      await delay(300)
      let file = await message.toFileBox()
      const base64 = await file.toBase64()
      textBox = FileBox.fromBase64(base64, file.name)
    }
    if (type === bot.Message.Type.Text) {
      messageType = 'Text'
      textBox = '文本信息'
    }
    if (type === bot.Message.Type.Video) {
      messageType = 'Video'
      let file = await message.toFileBox()
      const base64 = await file.toBase64()
      textBox = FileBox.fromBase64(base64, file.name)
    }
    if (type === bot.Message.Type.Url) {
      messageType = 'Url'
      textBox = await message.toUrlLink()
    }
    if (type === bot.Message.Type.MiniProgram) {
      messageType = 'MiniProgram'
      textBox = await message.toMiniProgram()
    }

    console.debug('textBox:', textBox)

    let room = message.room() || {}
    room = JSON.parse(JSON.stringify(room))
    // console.log(room)

    if (room && room.id) {
      //   delete room._payload.memberIdList
    }

    let payload = {
      talker,
      to,
      room,
      type,
      messageType,
      text,
      message,
      textBox,
    }
    console.debug(payload)

    // ding/dong test
    if (/^ding$/i.test(message.text())) {
      await message.say('dong')
    }
    // 匹配 message.text() 内容是不是 leetcode: 开头的
    if ((message.text() + '').startsWith('leetcode:')) {
      const userSlug = message.text().split(':')[1]
      yesterdayData(userSlug).then(async res => {
        let msg = `${userSlug}的刷题进度：\n\n总刷题数据：\n`
        msg += await getACQuestionsMsg(userSlug)
        msg += `\n昨日共刷题 ${res.length} 道\n`
        res.map(item => {
          msg += `${item.question.questionFrontendId}:${item.question.translatedTitle} \n`
        })
        if (res.length === 0) {
          const leetcodeDataList = await getLeetcodeData(userSlug)
          if (leetcodeDataList.length > 0) {
            first = leetcodeDataList[0]
            // submitTime时间戳转日期字符串
            const submitDateTime = new Date(first.submitTime * 1000)
            // submitTime 转年月日

            msg += `\n上一次在 ${submitDateTime.toLocaleDateString()} 做的  ${
              first.question.translatedTitle
            }`
          }
        }
        await message.say(msg)
      })
    }

    // 匹配 message.text() 内容是不是 查询 @ 开头的
    if (
      (message.text() + '').startsWith('查询') &&
      message.text().split('@').length > 1
    ) {
      const userName = message.text().split('@')[1]
      const userSlug = MEMBER_NAME_LEETCODE[userName]
      if (userSlug) {
        todayData(userSlug).then(async res => {
          let msg = `${userName}的刷题进度：\n\n总刷题数据：\n`
          msg += await getACQuestionsMsg(userSlug)
          msg += `\n今天共刷题 ${res.length} 道\n`
          res.map(item => {
            msg += `${item.question.questionFrontendId}:${item.question.translatedTitle} \n`
          })
          if (res.length === 0) {
            const leetcodeDataList = await getLeetcodeData(userSlug)
            if (leetcodeDataList.length > 0) {
              first = leetcodeDataList[0]
              // submitTime时间戳转日期字符串
              const submitDateTime = new Date(first.submitTime * 1000)
              // submitTime 转年月日

              msg += `\n上一次在 ${submitDateTime.toLocaleString()} 做的  ${
                first.question.translatedTitle
              }`
            }
          }
          await message.say(msg)
        })
      } else {
        await message.say(`没有${userName}的leetcode账户数据`)
      }
    }

    if (
      (message.text() + '').startsWith('昨天') &&
      message.text().split('@').length > 1
    ) {
      const userName = message.text().split('@')[1]
      const userSlug = MEMBER_NAME_LEETCODE[userName]
      if (userSlug) {
        yesterdayData(userSlug).then(async res => {
          let msg = `${userName}的刷题进度：\n\n总刷题数据：\n`
          msg += await getACQuestionsMsg(userSlug)
          msg += `\n昨日共刷题 ${res.length} 道\n`
          res.map(item => {
            msg += `${item.question.questionFrontendId}:${item.question.translatedTitle} \n`
          })
          if (res.length === 0) {
            const leetcodeDataList = await getLeetcodeData(userSlug)
            if (leetcodeDataList.length > 0) {
              first = leetcodeDataList[0]
              // submitTime时间戳转日期字符串
              const submitDateTime = new Date(first.submitTime * 1000)
              // submitTime 转年月日

              msg += `\n上一次在 ${submitDateTime.toLocaleString()} 做的  ${
                first.question.translatedTitle
              }`
            }
          }
          await message.say(msg)
        })
      } else {
        await message.say(`没有${userName}的leetcode账户数据`)
      }
    }
  } catch (err) {
    console.error(err)
  }
}
bot
  .on('scan', (qrcode, status) => {
    if (status === ScanStatus.Waiting && qrcode) {
      const qrcodeImageUrl = [
        'https://wechaty.js.org/qrcode/',
        encodeURIComponent(qrcode),
      ].join('')

      log.info(
        'TestBot',
        `onScan: ${ScanStatus[status]}(${status}) - ${qrcodeImageUrl}`
      )

      require('qrcode-terminal').generate(qrcode, {
        small: true,
      }) // show qrcode on console
    } else {
      log.info('TestBot', `onScan: ${ScanStatus[status]}(${status})`)
    }
  })
  .on('login', user => {
    log.info('TestBot', `${user} login`)
    leetcodeSchedule(bot, LEETCODE_NAME_SLUG)
  })
  .on('logout', (user, reason) => {
    log.info('TestBot', `${user} logout, reason: ${reason}`)
  })
  .on('heartbeat', data => {
    console.debug('on heartbeat:', data)
  })
  .on('ready', async () => {
    console.debug('on ready')
  })
  .on('message', onMessage)
  .on('error', error => {
    log.error('TestBot', 'on error: ', error.stack)
  })

bot
  .start()
  .then(() => {
    return log.info('StarterBot', 'Starter Bot Started.')
  })
  .catch(console.error)
