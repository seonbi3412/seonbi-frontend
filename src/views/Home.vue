<template>
  <div class="home d-flex justify-content-center row">
    <!-- <search-bar class="my-3" :movies="movies" @input-change-event="onInputChange"/> -->
    <!-- <movie-list :movies="movies"/> -->
    <Boxoffice class="my-5 col-8" :boxoffice="boxoffice" :reviews="reviews"/>  
    <RecommendMovies class="my-5 col-4" :movies="movies" :reviews="reviews" :users="users" :reMovies="reMovies"/>
  </div>
</template>

<script>
// @ is an alias to /src
// import SearchBar from '@/components/SearchBar.vue'
// import MovieList from '@/components/home/MovieList_h.vue'
import Boxoffice from '@/components/home/Boxoffice.vue'
import RecommendMovies from '@/components/home/RecommendMovies.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'home',
  components: {
    // SearchBar,
    // MovieList,
    Boxoffice,
    RecommendMovies
  },
  data() {
    return {
    }
  },
  props: {
    movies: {
      type: Array,
      required: true
    },
    reMovies: {
      type: Array,
      required: true
    },
    boxoffice: {
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
    reviews: {
      type: Array,
      required: true
    }
  },
  methods: {
    onInputChange(value) {
      var router = this.$router
      router.push({
        name: 'search',
        params: {movieName:value}
      })
    },
  },
  computed: {
    ...mapGetters([
      'options',
      'user'
    ])
  },
  mounted() {

  }
}
</script>

<style>
  div {
    background-color: rgba(0, 0, 0, 0);
  }
</style>