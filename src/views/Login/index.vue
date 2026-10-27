<script setup>
/**
 * [AI 完成说明]
 * 功能：账号密码登录与手机验证码登录双模式切换。
 * 关键内容：AI 新增短信发送、60 秒重发倒计时、表单校验、
 * 重复提交保护，以及两种登录方式共用的购物车合并流程。
 * 完成者：AI（Codex）
 */
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getLoginCodeAPI } from '@/apis/user'
import { useCountDown } from '@/composables/useCountDown'

const userStore = useUserStore()
const router = useRouter()
const loginType = ref('account')
const formRef = ref(null)
const submitting = ref(false)
const sendingCode = ref(false)
const { time: countdown, start: startCountdown } = useCountDown()

const form = ref({
  account: 'xiaotuxian001',
  password: '123456',
  mobile: '13888888888',
  code: '',
  agree: true
})

const codeButtonText = computed(() => {
  return countdown.value > 0 ? `${countdown.value}s后重发` : '获取验证码'
})

const rules = computed(() => ({
  ...(loginType.value === 'account'
    ? {
        account: [{ required: true, message: '用户名不能为空' }],
        password: [
          { required: true, message: '密码不能为空' },
          { min: 6, max: 24, message: '密码长度要求6-24个字符' }
        ]
      }
    : {
        mobile: [
          { required: true, message: '手机号不能为空' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
        ],
        code: [
          { required: true, message: '验证码不能为空' },
          { pattern: /^\d{6}$/, message: '请输入6位数字验证码' }
        ]
      }),
  agree: [
    {
      validator: (rule, value, callback) => {
        if (value) {
          callback()
        } else {
          callback(new Error('请勾选协议'))
        }
      }
    }
  ]
}))

const switchLoginType = (type) => {
  loginType.value = type
  formRef.value?.clearValidate()
}

// [AI] 发送验证码前只校验手机号，成功后启动60秒倒计时
const sendCode = async () => {
  if (countdown.value > 0 || sendingCode.value) return

  try {
    await formRef.value.validateField('mobile')
  } catch {
    return
  }

  sendingCode.value = true
  try {
    const res = await getLoginCodeAPI(form.value.mobile)
    if (res.code !== '1') {
      ElMessage.warning(res.msg || '验证码发送失败')
      return
    }
    startCountdown(60)
    ElMessage.success('验证码已发送，默认验证码为 123456')
  } catch {
    // 请求错误由 HTTP 响应拦截器统一提示
  } finally {
    sendingCode.value = false
  }
}

// [AI] 根据当前登录模式调用不同接口，成功后由 userStore 合并购物车
const doLogin = async () => {
  if (submitting.value) return

  try {
    await formRef.value.validate()
  } catch {
    return
  }

  submitting.value = true
  try {
    if (loginType.value === 'account') {
      await userStore.getUserInfo({
        account: form.value.account,
        password: form.value.password
      })
    } else {
      await userStore.getUserInfoByCode({
        mobile: form.value.mobile,
        code: form.value.code
      })
    }
    ElMessage.success('登录成功')
    router.replace({ path: '/' })
  } catch (error) {
    if (error?.isBusinessError) {
      ElMessage.error(error.message)
    }
  } finally {
    submitting.value = false
  }
}
</script>


<template>
  <div>
    <header class="login-header">
      <div class="container m-top-20">
        <h1 class="logo">
          <RouterLink to="/">小兔鲜</RouterLink>
        </h1>
        <RouterLink class="entry" to="/">
          进入网站首页
          <i class="iconfont icon-angle-right"></i>
          <i class="iconfont icon-angle-right"></i>
        </RouterLink>
      </div>
    </header>
    <section class="login-section">
      <div class="wrapper">
        <nav>
          <a
            href="javascript:;"
            :class="{ active: loginType === 'account' }"
            @click="switchLoginType('account')"
          >
            账户登录
          </a>
          <a
            href="javascript:;"
            :class="{ active: loginType === 'code' }"
            @click="switchLoginType('code')"
          >
            手机验证码登录
          </a>
        </nav>
        <div class="account-box">
          <div class="form">
            <el-form
              ref="formRef"
              :model="form"
              :rules="rules"
              label-position="right"
              label-width="68px"
              status-icon
              @keyup.enter="doLogin"
            >
              <template v-if="loginType === 'account'">
                <el-form-item prop="account" label="账户">
                  <el-input v-model="form.account" placeholder="xiaotuxian001" />
                </el-form-item>
                <el-form-item prop="password" label="密码">
                  <el-input
                    v-model="form.password"
                    type="password"
                    show-password
                    placeholder="123456"
                  />
                </el-form-item>
              </template>
              <template v-else>
                <el-form-item prop="mobile" label="手机号">
                  <el-input
                    v-model="form.mobile"
                    maxlength="11"
                    inputmode="numeric"
                    placeholder="请输入手机号"
                  />
                </el-form-item>
                <el-form-item prop="code" label="验证码">
                  <el-input
                    v-model="form.code"
                    maxlength="6"
                    inputmode="numeric"
                    placeholder="123456"
                  >
                    <template #append>
                      <el-button
                        class="code-btn"
                        native-type="button"
                        :loading="sendingCode"
                        :disabled="countdown > 0"
                        @click="sendCode"
                      >
                        {{ codeButtonText }}
                      </el-button>
                    </template>
                  </el-input>
                </el-form-item>
              </template>
              <el-form-item label-width="22px" prop="agree">
                <el-checkbox size="large" v-model="form.agree">
                  我已同意隐私条款和服务条款
                </el-checkbox>
              </el-form-item>
              <el-button
                size="large"
                class="subBtn"
                :loading="submitting"
                @click="doLogin"
              >
                登录
              </el-button>
            </el-form>
          </div>
        </div>
      </div>
    </section>

    <footer class="login-footer">
      <div class="container">
        <p>
          <a href="javascript:;">关于我们</a>
          <a href="javascript:;">帮助中心</a>
          <a href="javascript:;">售后服务</a>
          <a href="javascript:;">配送与验收</a>
          <a href="javascript:;">商务合作</a>
          <a href="javascript:;">搜索推荐</a>
          <a href="javascript:;">友情链接</a>
        </p>
        <p>CopyRight &copy; 小兔鲜儿</p>
      </div>
    </footer>
  </div>
</template>

<style scoped lang='scss'>
.login-header {
  background: #fff;
  border-bottom: 1px solid #e4e4e4;

  .container {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  .logo {
    width: 200px;

    a {
      display: block;
      height: 132px;
      width: 100%;
      text-indent: -9999px;
      background: url("@/assets/images/logo.png") no-repeat center 18px / contain;
    }
  }

  .sub {
    flex: 1;
    font-size: 24px;
    font-weight: normal;
    margin-bottom: 38px;
    margin-left: 20px;
    color: #666;
  }

  .entry {
    width: 120px;
    margin-bottom: 38px;
    font-size: 16px;

    i {
      font-size: 14px;
      color: $xtxColor;
      letter-spacing: -5px;
    }
  }
}

.login-section {
  background: url('@/assets/images/login-bg.png') no-repeat center / cover;
  height: 488px;
  position: relative;

  .wrapper {
    width: 380px;
    background: #fff;
    position: absolute;
    left: 50%;
    top: 54px;
    transform: translate3d(100px, 0, 0);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);

    nav {
      font-size: 14px;
      height: 55px;
      margin-bottom: 20px;
      border-bottom: 1px solid #f5f5f5;
      display: flex;
      padding: 0 40px;
      text-align: right;
      align-items: center;

      a {
        flex: 1;
        line-height: 1;
        display: inline-block;
        font-size: 18px;
        position: relative;
        text-align: center;
        color: #999;

        &.active {
          color: $xtxColor;

          &::after {
            content: "";
            position: absolute;
            right: 24px;
            bottom: -18px;
            left: 24px;
            height: 2px;
            background: $xtxColor;
          }
        }
      }
    }
  }
}

.login-footer {
  padding: 30px 0 50px;
  background: #fff;

  p {
    text-align: center;
    color: #999;
    padding-top: 20px;

    a {
      line-height: 1;
      padding: 0 10px;
      color: #999;
      display: inline-block;

      ~a {
        border-left: 1px solid #ccc;
      }
    }
  }
}

.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;

    a {
      color: $xtxColor;

      i {
        font-size: 14px;
      }
    }
  }

  .form {
    padding: 0 20px 20px 20px;

    &-item {
      margin-bottom: 28px;

      .input {
        position: relative;
        height: 36px;

        >i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }

        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;

          &.error {
            border-color: $priceColor;
          }

          &.active,
          &:focus {
            border-color: $xtxColor;
          }
        }

        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }

      >.error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: $priceColor;

        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }

    .agree {
      a {
        color: #069;
      }
    }

    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: $xtxColor;

      &.disabled {
        background: #cfcdcd;
      }
    }

    :deep(.el-input-group__append) {
      padding: 0;
    }

    .code-btn {
      width: 92px;
      height: 32px;
      padding: 0;
      border: 0;
      background: transparent;
      color: $xtxColor;
      font-size: 13px;
    }
  }

  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}

.subBtn {
  background: $xtxColor;
  width: 100%;
  color: #fff;
}
</style>
