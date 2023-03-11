// https://gist.github.com/jiftechnify/1a6cfb1b3c1062b65978713010c5422a
import { AtpAgent } from "@atproto/api";

(() => {
	const dtformat = new Intl.DateTimeFormat('ja-jp', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	});
	const getTLButton = <HTMLButtonElement>document.getElementById("gettl");
	const getProfileButton = <HTMLButtonElement>document.getElementById("getprofile");
	const setProfileButton = <HTMLButtonElement>document.getElementById("setprofile");
	getTLButton.addEventListener("click", () => {
		(<HTMLElement>document.getElementById("log")).textContent = "";
		(<HTMLElement>document.getElementById("error")).textContent = "";
		const serviceInput = <HTMLInputElement>document.getElementById("service");
		const emailInput = <HTMLInputElement>document.getElementById("email");
		const passwordInput = <HTMLInputElement>document.getElementById("password");
		if (!serviceInput.value || !emailInput.value || !passwordInput.value){
			return;
		}
		(<HTMLElement>document.getElementById("log")).textContent = "取得中・・・";
		getTLButton.disabled = true;
		const main = async () => {
			const agent = new AtpAgent({
				service: "https://" + serviceInput.value,
			});
			await agent.login({
				identifier: emailInput.value,
				password: passwordInput.value,
			});
			const dl = <HTMLElement>document.getElementById("tl");
			dl.innerHTML = "";
			const tl = await agent.api.app.bsky.feed.getTimeline({});
			for (const p of tl.data.feed) {
				console.log(p);
				const dt = <HTMLElement>document.createElement("dt");
				dt.textContent = p.post.author.displayName + " " + p.post.author.handle + " " + dtformat.format(new Date(p.post.indexedAt));
				if (p.post.author.avatar) {
					const img = document.createElement("img");
					img.setAttribute("src", p.post.author.avatar);
					img.setAttribute("width", "50");
					img.setAttribute("height", "50");
					dt.prepend(img);
				}
				const dd = <HTMLElement>document.createElement("dd");
				const p1 = document.createElement("p");
				p1.textContent = (p.post.record as any).text;
				const p2 = document.createElement("p");
				p2.textContent = "☜" + p.post.replyCount + " 🔁" + p.post.repostCount + " ❤" + p.post.upvoteCount;
				dd.appendChild(p1);
				dd.appendChild(p2);
				dl.appendChild(dt);
				dl.appendChild(dd);
			}
		};
		main()
			.then(() => {
				console.log("fin");
				getTLButton.disabled = false;
				(<HTMLElement>document.getElementById("log")).textContent = "complete";
				(<HTMLElement>document.getElementById("error")).textContent = "";
			})
			.catch((e) => {
				console.error(e);
				getTLButton.disabled = false;
				(<HTMLElement>document.getElementById("log")).textContent = "";
				(<HTMLElement>document.getElementById("error")).textContent = e.message;
			});
	});
	getProfileButton.addEventListener("click", () => {
		(<HTMLElement>document.getElementById("log")).textContent = "";
		(<HTMLElement>document.getElementById("error")).textContent = "";
		const serviceInput = <HTMLInputElement>document.getElementById("service");
		const emailInput = <HTMLInputElement>document.getElementById("email");
		const passwordInput = <HTMLInputElement>document.getElementById("password");
		const account = <HTMLInputElement>document.getElementById("account");
		if (!serviceInput.value || !emailInput.value || !passwordInput.value || !account.value){
			return;
		}
		(<HTMLElement>document.getElementById("log")).textContent = "取得中・・・";
		getProfileButton.disabled = true;
		const main = async () => {
			const agent = new AtpAgent({
				service: "https://" + serviceInput.value,
			});
			const actor = account.value + '.' + serviceInput.value;
			await agent.login({
				identifier: emailInput.value,
				password: passwordInput.value,
			});
			const prof = await agent.api.app.bsky.actor.getProfile({actor: actor});
			const avatarPreview = <HTMLElement>document.getElementById("avatar-preview");
			avatarPreview.innerHTML = "";
			const bannerPreview = <HTMLElement>document.getElementById("banner-preview");
			bannerPreview.innerHTML = "";
			const imgAvatar = <HTMLImageElement>document.createElement("img");
			imgAvatar.setAttribute("src", prof.data.avatar || "");
			imgAvatar.setAttribute("width", "50");
			avatarPreview.appendChild(imgAvatar);
			const imgBanner = <HTMLImageElement>document.createElement("img");
			imgBanner.setAttribute("src", prof.data.banner || "");
			imgBanner.setAttribute("width", "400");
			bannerPreview.appendChild(imgBanner);
			const avatarURL = <HTMLInputElement>document.getElementById("avatar-url");
			avatarURL.value = prof.data.avatar || "";
			const bannerURL = <HTMLInputElement>document.getElementById("banner-url");
			bannerURL.value = prof.data.banner || "";
			const displayName = <HTMLInputElement>document.getElementById("displayname");
			displayName.value = prof.data.displayName || "";
			const description = <HTMLInputElement>document.getElementById("description");
			description.value = prof.data.description || "";
			console.log(prof);
		};
		main()
			.then(() => {
				console.log("fin");
				getProfileButton.disabled = false;
				(<HTMLElement>document.getElementById("log")).textContent = "complete";
				(<HTMLElement>document.getElementById("error")).textContent = "";
			})
			.catch((e) => {
				console.error(e);
				getProfileButton.disabled = false;
				(<HTMLElement>document.getElementById("log")).textContent = "";
				(<HTMLElement>document.getElementById("error")).textContent = e.message;
			});
	});
	setProfileButton.addEventListener("click", () => {
		(<HTMLElement>document.getElementById("log")).textContent = "";
		(<HTMLElement>document.getElementById("error")).textContent = "";
		const serviceInput = <HTMLInputElement>document.getElementById("service");
		const emailInput = <HTMLInputElement>document.getElementById("email");
		const passwordInput = <HTMLInputElement>document.getElementById("password");
		const account = <HTMLInputElement>document.getElementById("account");
		if (!serviceInput.value || !emailInput.value || !passwordInput.value || !account.value){
			return;
		}
		(<HTMLElement>document.getElementById("log")).textContent = "設定中・・・";
		setProfileButton.disabled = true;
		const main = async () => {
			const agent = new AtpAgent({
				service: "https://" + serviceInput.value,
			});
			const actor = account.value + '.' + serviceInput.value;
			await agent.login({
				identifier: emailInput.value,
				password: passwordInput.value,
			});
			const avatarURL = <HTMLInputElement>document.getElementById("avatar-url");
			const bannerURL = <HTMLInputElement>document.getElementById("banner-url");
			const displayName = <HTMLInputElement>document.getElementById("displayname");
			const description = <HTMLInputElement>document.getElementById("description");
			let contentTypeAvatar;
			let uploadIconResp;
			if ((<HTMLInputElement>document.getElementById("avatar-select-from")).checked) {
				const responseAvatar = await fetch(avatarURL.value);
				contentTypeAvatar = responseAvatar.headers.get("content-type") || "";
				const avatarImageBlob: Blob = await responseAvatar.blob();
				const arrayBufferAvatar: ArrayBuffer = await avatarImageBlob.arrayBuffer();
				const avatarImage: Uint8Array = new Uint8Array(arrayBufferAvatar);
				uploadIconResp = await agent.api.com.atproto.blob.upload(
					avatarImage, {
					encoding: contentTypeAvatar,
				});
			}
			else {
				//TODO
				return;
			}
			let contentTypeBanner;
			let uploadBannerResp;
			if ((<HTMLInputElement>document.getElementById("banner-select-from")).checked) {
				const responseBanner = await fetch(bannerURL.value);
				contentTypeBanner = responseBanner.headers.get("content-type") || "";
				const bannerImageBlob: Blob = await responseBanner.blob();
				const arrayBufferBanner: ArrayBuffer = await bannerImageBlob.arrayBuffer();
				const bannerImage: Uint8Array = new Uint8Array(arrayBufferBanner);
				uploadBannerResp = await agent.api.com.atproto.blob.upload(
					bannerImage, {
					encoding: contentTypeBanner
				});
			}
			else {
				//TODO
				return;
			}
			const createProfileResp = await agent.api.app.bsky.actor.updateProfile({
				displayName: displayName.value,
				description: description.value,
				avatar: { cid: uploadIconResp.data.cid, mimeType: contentTypeAvatar },
				banner: { cid: uploadBannerResp.data.cid, mimeType: contentTypeBanner }
			});
			console.log(createProfileResp);
		};
		main()
			.then(() => {
				console.log("fin");
				setProfileButton.disabled = false;
				(<HTMLElement>document.getElementById("log")).textContent = "complete";
				(<HTMLElement>document.getElementById("error")).textContent = "";
			})
			.catch((e) => {
				console.error(e);
				setProfileButton.disabled = false;
				(<HTMLElement>document.getElementById("log")).textContent = "";
				(<HTMLElement>document.getElementById("error")).textContent = e.message;
			});
	});
})();
