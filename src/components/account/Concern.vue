<template>
  <div class="concern">
    <b-form @submit.prevent="userConcern">
      <b-form-group label="관심 장르를 선택해주세요">
        <b-form-checkbox
        v-model="value"
        v-for="genre in genres" :key="genre.id" :value="genre"
        :state="state"
        name="checkbox-validation"
        inline
      > {{genre.name}}</b-form-checkbox>
        <b-form-invalid-feedback :state="state">Please select two</b-form-invalid-feedback>
        <b-form-valid-feedback :state="state">Thank you</b-form-valid-feedback>
        
      </b-form-group>
      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
  </div>
</template>

<script>
  import router from '../../router'
  import axios from 'axios'
  import { mapGetters } from 'vuex'
  export default {
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
        value: [],
      }
    },
    computed: {
      state() {
        return this.value.length >= 2
      },
      ...mapGetters([
        'options',
        'user'
      ])
    },
    methods: {
      userConcern() {
        axios.get(`https://seonbi3412.herokuapp.com/movies/users/${this.user.user_id}/`)
          .then(response => {
            console.log(response)
            let data = this.value
            axios.put(`https://seonbi3412.herokuapp.com/movies/users/${this.user.user_id}/update_delete/`, data, this.options)
              .then(response => {
                console.log(response)
                this.$emit('redataload', true)
                router.push('/')
              })
              .catch(error => {
                console.log(error)
              })
          })
          .catch(error => {
            console.log(error)
          })
      }
    }
  }
</script>