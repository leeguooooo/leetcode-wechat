// 每天下午四点发送消息
var schedule = require('node-schedule')
const {
  yesterdayData,
  getLeetcodeData,
  getACQuestionsMsg,
} = require('./getLeetcodeData')

// 定时发送消息
const leetcodeSchedule = async (bot, LEETCODE_NAME_SLUG) => {
  var rule = new schedule.RecurrenceRule()
  rule.hour = 15
  rule.minute = 06
  rule.second = 0
  schedule.scheduleJob('0 30 11 * * 1-5', async function () {
    const room = await bot.Room.find({topic: '小伙伴'})
    // promise.all 批量获取用户 yesterdayData
    const leetcodeDataList = await Promise.all(
      Object.keys(LEETCODE_NAME_SLUG).map(async userSlug => {
        return {
          user: LEETCODE_NAME_SLUG[userSlug],
          data: await yesterdayData(userSlug),
        }
      })
    )
    // 拼接消息
    let msg = `昨日共刷题 ${leetcodeDataList.reduce((total, item) => {
      return total + item.data.length
    }, 0)} 道\n`
    leetcodeDataList.map(item => {
      msg += `\n@${item.user} : ${item.data.length || 0} 道\n`
      item.data.map(d => {
        msg += `${d.question.questionFrontendId}:${d.question.translatedTitle} \n`
      })
    })
    msg += `\n\n偷懒的小伙伴明天要加油哦~\n`
    msg += `\n输入"查询 @姓名" 查询今天某人的刷题进度`
    msg += `\n输入"昨天 @姓名" 查询昨天某人的刷题进度`
    // 发送消息
    await room.say(msg)
  })
}

module.exports = {
  leetcodeSchedule,
}
