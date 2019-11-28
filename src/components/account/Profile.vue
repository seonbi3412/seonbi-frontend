<template>
  <div class="profile row text-light">
    <div class="col-2">
      <h1 class="display-2 text-light">{{profile_user.username}}</h1>
      <b-button class="btn-info" to="/account/edit" v-if="this.user.user_id===profile_user.id">edit</b-button>
    </div>
    <div class="col-10 table text-light">
      <div class="row">
        <h3 class="my-2 row">좋아하는 영화</h3>
        <div class="container row py-3">
          <router-link :to="`/movies/${movie.id}`" v-for="movie in profile_user.like_movies" :key="movie.id">
            <p class="name text-light">{{movie.title}}</p>
            <img :src="`https://image.tmdb.org/t/p/w200${movie.poster_url}`" alt="">
          </router-link>
        </div>
      </div>
      <div class="row">
        <h3 class="my-2 row">좋아하는 배우</h3>
        <div class="container row py-3">
          <router-link :to="`/actors/${actor.id}`" v-for="actor in profile_user.like_actors" :key="actor.id">
            <p class="name text-light">{{ actor.name }}</p>
            <img :src="`https://image.tmdb.org/t/p/w200${actor.profile_path}`" :alt="actor.name">
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
export default {
  name: 'profile',
  props: {
    movies: {
      type: Array,
      required: true
    },
    genres: {
      type: Array,
      required: true
    },
    users:{
      type: Array,
      required: true
    },
    actors:{
      type: Array,
      required: true
    },
  },
  data() {
    return {
      profile_user: {}
    }
  },
  computed: {
    ...mapGetters([
      'options',
      'user'
    ])
  },
  mounted() {
    axios.get(`https://seonbi3412.herokuapp.com/movies/users/${this.$route.params.id}`)
        .then(response => {
          console.log(response)
          this.profile_user = response.data
        })
        .catch(error => {
          console.log(error)
        })
  }
}
</script>

<style>
</style>