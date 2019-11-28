<template>
  <div class="profile row">
    <div class="col-2">
      <h1 class="display-2 text-light">{{profile_user.username}}</h1>
      <b-button class="btn-info" to="/account/edit" v-if="this.user.user_id===profile_user.id">edit</b-button>
    </div>
    <div class="col-5">
      <ul>
        <li v-for="movie in profile_user.like_movies" :key="movie.id">
          {{movie.title}}
        </li>
      </ul>
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