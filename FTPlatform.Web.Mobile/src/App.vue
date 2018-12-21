<template>
    <div id="app">
    </div>
</template>

<script>
export default {
    name: 'app',
    data() {
        return {}
    },
    created() {
        $('body').on('touchmove', function (e) {
            if (!$('.l-scrollable').has($(e.target)).length) {
                e.preventDefault()
            }
        })
    }
}
</script>

<style>

</style>
