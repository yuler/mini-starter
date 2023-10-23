import { IApp } from '../../app'
import { promisify } from '../../utils'

const $app = getApp<IApp>()

Component({
  options: {
    styleIsolation: 'shared',
    multipleSlots: true,
  },
  data: {
    show: false,
    avatar: '',
    nickname: '',
  },
  pageLifetimes: {
    show() {
      this.setData({
        ...$app.$state.user,
      })
    },
  },
  lifetimes: {
    created() {
      $app.$on('popup:profile:open', async () => {
        await promisify(wx.requirePrivacyAuthorize)()
        this.setData({ show: true })
      })
      $app.$on('popup:profile:close', () => {
        this.setData({ show: false })
      })
    },
  },
  methods: {
    async refreshUserProfile() {},

    onChooseAvatar(event: MP.CustomEvent) {
      const { avatarUrl } = event.detail
      this.setData({
        avatar: avatarUrl,
      })
    },
    onInputNickname(event: MP.Input) {
      console.log(event)
      const { value } = event.detail
      this.setData({ nickname: value })
    },
    onNicknameReview(event: MP.CustomEvent) {
      console.log(event)
      const { pass, timeout } = event.detail
      console.log({ pass, timeout })
    },
    async onSubmit() {
      console.log(this.data)
      let { avatar, nickname } = this.data
      if (!avatar) {
        return $app.$toast('❌ 请设置头像')
      }
      if (!nickname) {
        return $app.$toast('❌ 请输入昵称')
      }
      // upload avatar
      if (!avatar.startsWith('http')) {
        wx.uploadFile({
          url: `xxx`,
          filePath: avatar,
          name: 'file',
          formData: {},
          success: result => {
            // TODO:
            const { url } = JSON.parse(result.data)
            avatar = url
          },
          fail(error) {
            console.log(error)
          },
        })
      }

      try {
        $app.$showLoading()
        // TODO:
        const { message } = await $app.$api({
          url: '/xxx',
          method: 'POST',
          data: {
            avatar,
            nickname,
          },
        })
        $app.$toast(message)
        this.setData({ show: false })
        await this.refreshUserProfile()
        this.triggerEvent('success')
      } catch (error: any) {
        $app.$toast(error.message)
      } finally {
        $app.$hideLoading()
      }
    },
  },
})
