<template>
	<div class="navbar">
		<nuxt-link to="/">SSE</nuxt-link>
		<nuxt-link to="/io">Socket</nuxt-link>
	</div>
</template>

<script>
export default {
	name: 'NavBar'
}
</script>

<style scoped>
.navbar {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 50px;
}
.navbar a {
	display: inline-block;
	padding: 5px 10px;
	margin-left: 5px;
	margin-right: 5px;
	border-radius: 3px;
	color: #35495e;
	text-decoration: none;
}
.navbar a:hover {
	color: #fff;
	background: #01c58eb9;
}
</style>
