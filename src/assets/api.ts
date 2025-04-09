import Project from "@/components/app/student/Project.vue";
import axios from "axios";

class API {
    apiUrl = "http://localhost:8080/api";
    loginState = false;

    getCookie(value: string) {
        let c = document.cookie.split('; ').find(cookie => cookie.startsWith(`${value}=`));
        if (c) {
            return c.split('=')[1];
        } else {
            return null;
        }
    }

    setCookie(name: string, value: string) {
        var date = new Date();
        date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
        var expires = "expires=" + date.toUTCString();
        document.cookie = `${name}=${value}; ${expires}; path=/`;
    }

    delCookie(name: string) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    }

    clearCookies() {
        this.delCookie('id');
        this.delCookie('username');
        this.delCookie('role');
        this.delCookie('token');
    }

    transProjectRole(role: any) {
        switch (role) {
            case "leader":
                return "组长";
            case "member":
                return "成员";
            default:
                return role;
        }
    }

    transProjectStatus(status: any) {
        switch (status) {
            case "normal":
                return "进行中";
            case "finish":
                return "完成";
            case "cancel":
                return "取消";
            default:
                return status;
        }
    }

    transTaskStatus(status: any) {
        switch (status) {
            case "plane":
                return "计划";
            case "normal":
                return "进行中";
            case "finish":
                return "完成";
            case "cancel":
                return "取消";
            default:
                return status;
        }
    }
}

export let api = new API();

const apiClient = axios.create({
    baseURL: api.apiUrl, // 后端地址
    timeout: 2000, // 超时时间
});

// 请求拦截器，自动添加 Authorization 头
apiClient.interceptors.request.use(
    (config) => {
        const token = api.getCookie('token'); // 获取 token
        if (token) {
            config.headers["Authorization"] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;