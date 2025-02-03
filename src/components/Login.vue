<template>
    <div class="login-form">
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
            <div>
                <label for="email">Email:</label>
                <input id="email" v-model="email" type="email" placeholder="Enter email" required />
            </div>
            <div>
                <label for="password">Password:</label>
                <input id="password" v-model="password" type="password" placeholder="Enter password" required />
            </div>
            <button type="submit">Login</button>
        </form>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { directus } from '@/services/directus';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

const handleLogin = async () => {
    if (!email.value || !password.value) {
        errorMessage.value = 'Please fill in both fields.';
        return;
    }

    try {
        const result = await directus.login(email.value, password.value);
        
        localStorage.setItem('directus_token', result.access_token);

        router.push('/listStock');

        console.log('Logged in successfully');
    } catch (error) {
        errorMessage.value = 'Invalid credentials, please try again.';
        console.error('Login error:', error.response?.data || error.message);
    }
};
</script>

<style scoped>
.login-form {
    max-width: 400px;
    margin: 50px auto;
    padding: 30px;
    border-radius: 12px;
    background: linear-gradient(145deg, #e0eafc, #cfdef3);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

h2 {
    text-align: center;
    color: #333;
    margin-bottom: 30px;
    font-family: 'Arial', sans-serif;
}

form div {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 8px;
    color: #333;
    font-size: 14px;
    font-weight: bold;
}

input {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    color: #333;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 6px;
    box-sizing: border-box;
    transition: all 0.3s ease;
}

input:focus {
    border-color: #4CAF50;
    outline: none;
    box-shadow: 0 0 8px rgba(76, 175, 80, 0.5);
}

button {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    color: #fff;
    background-color: #4CAF50;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #45a049;
}

.error {
    color: red;
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
}
</style>
