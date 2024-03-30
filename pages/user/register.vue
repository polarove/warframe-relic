<template>
  <div class="flex-center-col">
    <wt-logo style="transform: scale(1.4); margin-bottom: 25px" />
    <div class="mb-2em">注册到 warframe team</div>
    <el-card class="w-15vw">
      <el-form :model="registerForm" label-position="top">
        <el-form-item label="用户名或邮箱">
          <el-input v-model="registerForm.username" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="registerForm.password" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" flex="1">
            <span class="font-small">注册</span>
          </el-button>
        </el-form-item>
        <el-divider> or </el-divider>
        <el-form-item>
          <el-button flex="1" @click="passkey">
            <span class="i-mdi:account-key font-large mr-5px"></span>
            <span class="font-small">使用 passkey 快速认证</span>
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { registerByPasskey } from '~/utils/web-auth/register'
import type { RegistrationEncoded } from '~/utils/web-auth/shared/types'
const registerForm = reactive({
  username: '',
  password: ''
})

const passkey = async () => {
  const challenge = 'a7c61ef9-dc23-4806-b486-2428938a547e'
  const registration = await registerByPasskey('刘棋', challenge, {
    authenticatorType: 'auto',
    userVerification: 'required',
    timeout: 60000,
    attestation: true,
    userHandle: 'ijewitiksg',
    debug: true
  })
  requestVerification(registration)
}
const requestVerification = async (registration: RegistrationEncoded) => {
  console.log('registration data: ', registration)
  const data = JSON.stringify({
    username: registration.username,
    authentication_data: registration.authenticatorData,
    credential: {
      id: registration.credential.id,
      public_key: registration.credential.publicKey,
      algorithm: registration.credential.algorithm
    },
    client_data: registration.clientData,
    attestation_data: registration.attestationData
  })

  await useFetch('http://localhost:8080/credential/verificate', {
    method: 'POST',
    headers: useRequestHeaders(['content-type: plain/txt']),
    body: data
  })
    .then((response) => {
      console.log('server feedback on registration data: ', response.data.value)
    })
    .catch((err) => console.error(err))
}
</script>

<style lang="scss" scoped></style>
