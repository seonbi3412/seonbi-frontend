<template>
  <div class="actor container text-light d-flex justify-content-center align-items-center my-3">
    <div class="col-4">
      <h1>{{ actor.name }}</h1>
      <img :src="profile_path" :alt="actor.name">
      <br>
      <br>
      <p :class="{
        'h4': like_count >= 1,
        'h3': like_count >= 2,
        'h2': like_count >= 3,
        }">관심도 : <span :class="{ 
        'text-info': like_count >= 1,
        'text-primary': like_count >= 2,
        'text-success': like_count >= 3,
        'text-warning': like_count >= 4,
        'text-danger': like_count >= 5
        }">{{ like_count / 10 }}</span> %</p>
      <div class="container">
        <button class="btn btn-light" @click="likeActor" v-if="!isLiked && this.user"><font-awesome-icon class="text-secondary" icon="thumbs-up"/></button>
        <button class="btn btn-light" @click="likeActor" v-else-if="this.user"><font-awesome-icon class="text-primary" icon="thumbs-up"/></button>
      </div>
    </div>
    <div class="col-8">
      <h3>필모그래피</h3>
      <div class="row">
        <div v-for="filmo in actor.filmography" :key="filmo.id" class="m-2">
          <div @click="moveMovie(filmo)">
              <p class="text-info">{{ filmo.title }}</p>
              <img :src="`https://image.tmdb.org/t/p/w200${filmo.poster_url}`">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import router from '../../router'
import { mapGetters } from 'vuex'
export default {
  name: "actor",
data() {
    return {
      actor: {},
      profile_path: "",
      isLiked: false,
      like_count: 0,
    }
  },
  computed: {
    ...mapGetters([
      'options',
      'user'
    ]),
  },
  methods: {
    likeActor() {
      axios.post(`https://seonbi3412.herokuapp.com/movies/actors/${this.actor.id}/like/`, this.user, this.options)
        .then(response => {
          this.actor = response.data
          this.like_count = this.actor.like_users.length
          this.isLiked = false
          for(let idx in this.actor.like_users){
            if (this.actor.like_users[idx].id === this.user.user_id){
              this.isLiked = true
              break
            }
          }
          this.$emit('redataload', true)
        })
        .catch(error => {
          console.log(error)
        })
    },
    moveMovie(filmo) {
      router.push(`/movies/${filmo.id}`)
    }
  },
  mounted() {
    axios.get(`https://seonbi3412.herokuapp.com/movies/actors/${this.$route.params.id}/`)
      .then(response => {
        this.actor = response.data
        this.like_count = this.actor.like_users.length
        this.profile_path=`https://image.tmdb.org/t/p/w300${this.actor.profile_path}`
        this.isLiked = false
          for(let idx in this.actor.like_users){
            if (this.actor.like_users[idx].id === this.user.user_id){
              this.isLiked = true
              break
            }
          }
        })
      .catch(error => {
        console.log(error)
      })
  }
}
</script>

<style>
.filmography {
  text-decoration: none;
}
</style>