<template>
  <div class="memberBox">
    <div class="HeaderBox">
      <img :src="imgUrl" alt class="HeaderIcon" />
    </div>
    <div class="m-lore">
         <router-link to="/login" class="link-login">登录</router-link>
         <router-link to="/login" class="link-register">注册</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgUrl: require("../../assets/images/h.jpg")
    };
  }
};
</script>

<style  scoped>
.memberBox{
    display:flex;
    flex-direction: column ;
    justify-content: center;
    align-content: center;
    color: aliceblue;
}
.HeaderBox {
    flex: 1;
  margin: 0 auto;
  margin-top: 2.5rem;
  height: 64rem;
  width: 100%;
}
.HeaderIcon {
  border-radius: 50%;
  width: 15rem;
  height: 13rem;
}
.m-lore{
    flex: 1;
    display: flex;
}
.link-login {
    flex : 1;
    color: black;
}
.link-register{
     flex : 1;
     color: black;
}
</style>
