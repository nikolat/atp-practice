// https://gist.github.com/jiftechnify/1a6cfb1b3c1062b65978713010c5422a
import { AtpAgent } from "@atproto/api";

(() => {
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
				service: serviceInput.value,
			});
	
			await agent.login({
				identifier: emailInput.value,
				password: passwordInput.value,
			});
	
			const dl = <HTMLElement>document.getElementById("tl");
			const tl = await agent.api.app.bsky.feed.getTimeline({});
			for (const p of tl.data.feed) {
				console.log(p);
				const dt = <HTMLElement>document.createElement("dt");
				dt.textContent = p.post.author.displayName + ' ' + p.post.author.handle;
				const dd = <HTMLElement>document.createElement("dd");
				dd.textContent = (p.post.record as any).text + " ↻" + p.post.repostCount + " ♥" + p.post.upvoteCount;
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
				service: serviceInput.value,
			});
			const actor = account.value + '.bsky.social';
			await agent.login({
				identifier: emailInput.value,
				password: passwordInput.value,
			});
			const prof = await agent.api.app.bsky.actor.getProfile({actor: actor});
			const avatardt = <HTMLElement>document.getElementById("avatar-dt");
			avatardt.innerHTML = "";
			const bannerdt = <HTMLElement>document.getElementById("banner-dt");
			bannerdt.innerHTML = "";
			const imgAvatar = <HTMLImageElement>document.createElement("img");
			imgAvatar.setAttribute("src", prof.data.avatar || "");
			imgAvatar.setAttribute("width", "50");
			avatardt.appendChild(imgAvatar);
			const imgBanner = <HTMLImageElement>document.createElement("img");
			imgBanner.setAttribute("src", prof.data.banner || "");
			imgBanner.setAttribute("width", "600");
			bannerdt.appendChild(imgBanner);
			const avatar = <HTMLInputElement>document.getElementById("avatar");
			avatar.value = prof.data.avatar || "";
			const banner = <HTMLInputElement>document.getElementById("banner");
			banner.value = prof.data.banner || "";
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
				service: serviceInput.value,
			});
			const actor = account.value + '.bsky.social';
			await agent.login({
				identifier: emailInput.value,
				password: passwordInput.value,
			});
			const avatar = <HTMLInputElement>document.getElementById("avatar");
			const banner = <HTMLInputElement>document.getElementById("banner");
			const displayName = <HTMLInputElement>document.getElementById("displayname");
			const description = <HTMLInputElement>document.getElementById("description");

			const responseAvatar = await fetch(avatar.value);
			const contentTypeAvatar = responseAvatar.headers.get("content-type") || "";
			const avatarImageBlob: Blob = await responseAvatar.blob();
			const arrayBufferAvatar: ArrayBuffer = await avatarImageBlob.arrayBuffer();
			const avatarImage: Uint8Array = new Uint8Array(arrayBufferAvatar);
			const uploadIconResp = await agent.api.com.atproto.blob.upload(
				avatarImage, {
				encoding: contentTypeAvatar,
			});
			const responseBanner = await fetch(banner.value);
			const contentTypeBanner = responseBanner.headers.get("content-type") || "";
			const bannerImageBlob: Blob = await responseBanner.blob();
			const arrayBufferBanner: ArrayBuffer = await bannerImageBlob.arrayBuffer();
			const bannerImage: Uint8Array = new Uint8Array(arrayBufferBanner);
			const uploadBannerResp = await agent.api.com.atproto.blob.upload(
				bannerImage, {
				encoding: contentTypeBanner
			});
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
