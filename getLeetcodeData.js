const axios = require('axios')

const getLeetcodeData = async userSlug => {
  const url = 'https://leetcode.cn/graphql/noj-go/'
  const data = {
    query: `
						query recentAcSubmissions($userSlug: String!) {
	recentACSubmissions(userSlug: $userSlug) {
		submissionId
		submitTime
		question {
			translatedTitle
			titleSlug
			questionFrontendId
		}
	}
}
				`,
    variables: {
      userSlug,
    },
  }
  const res = await axios.post(url, data)
  return res.data.data.recentACSubmissions
}

const yesterdayData = async userSlug => {
  const recentACSubmissions = await getLeetcodeData(userSlug)
  const yesterday = new Date(
    new Date().getTime() - 24 * 60 * 60 * 1000
  ).toLocaleDateString()

  // recentACSubmissions 根据 titleSlug 字段去掉重复的昨天数据
  const recentACSubmissionsUnique = recentACSubmissions.reduce((acc, cur) => {
    if (!acc.some(item => item.titleSlug === cur.titleSlug)) {
      const submitDateTime = new Date(
        cur.submitTime * 1000
      ).toLocaleDateString()

      if (submitDateTime === yesterday) {
        acc.push(cur)
      }
    }
    return acc
  }, [])

  return recentACSubmissionsUnique
}

const todayData = async userSlug => {
  const recentACSubmissions = await getLeetcodeData(userSlug)
  const today = new Date().toLocaleDateString()

  const recentACSubmissionsToday = recentACSubmissions.reduce((acc, cur) => {
    if (!acc.some(item => item.titleSlug === cur.titleSlug)) {
      const submitDateTime = new Date(
        cur.submitTime * 1000
      ).toLocaleDateString()

      if (submitDateTime === today) {
        acc.push(cur)
      }
    }
    return acc
  }, [])

  return recentACSubmissionsToday
}

// https://leetcode.cn/graphql/
// {"query":"\n    query userQuestionProgress($userSlug: String!) {\n  userProfileUserQuestionProgress(userSlug: $userSlug) {\n    numAcceptedQuestions {\n      difficulty\n      count\n    }\n    numFailedQuestions {\n      difficulty\n      count\n    }\n    numUntouchedQuestions {\n      difficulty\n      count\n    }\n  }\n}\n    ","variables":{"userSlug":"leeguoo"}}
const getUserQuestionProgress = async userSlug => {
  const url = 'https://leetcode.cn/graphql/'
  const data = {
    query: `
            query userQuestionProgress($userSlug: String!) {
  userProfileUserQuestionProgress(userSlug: $userSlug) {
    numAcceptedQuestions {
      difficulty
      count
    }
    numFailedQuestions {
      difficulty
      count
    }
    numUntouchedQuestions {
      difficulty
      count
    }
  }
}
            `,
    variables: {
      userSlug,
    },
  }
  const res = await axios.post(url, data)
  return res.data.data.userProfileUserQuestionProgress
}

const getACQuestionsMsg = async userSlug => {
  const questions = await getUserQuestionProgress(userSlug)

  const numAcceptedQuestions = questions.numAcceptedQuestions
  let msg = ''
  numAcceptedQuestions.forEach(item => {
    msg += `${item.difficulty}: ${item.count}\n`
  })
  return msg
}

// fan_of_emptyhope
module.exports = {
  getLeetcodeData,
  yesterdayData,
  getUserQuestionProgress,
  getACQuestionsMsg,
  todayData,
}
