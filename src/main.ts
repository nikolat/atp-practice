// https://gist.github.com/jiftechnify/1a6cfb1b3c1062b65978713010c5422a
import { AtpAgent } from "@atproto/api";

(() => {
	const getTLButton = <HTMLButtonElement>document.getElementById("gettl");
	const getProfileButton = <HTMLButtonElement>document.getElementById("getprofile");
	const setProfileButton = <HTMLButtonElement>document.getElementById("setprofile");
	getTLButton.addEventListener("click", () => {
		(<HTMLElement>document.getElementById("log")).textContent = "取得中・・・";
		(<HTMLElement>document.getElementById("error")).textContent = "";
		const emailInput = <HTMLInputElement>document.getElementById("email");
		const passwordInput = <HTMLInputElement>document.getElementById("password");
		if (!emailInput.value || !passwordInput.value){
			return;
		}
		getTLButton.disabled = true;
		const main = async () => {
			const agent = new AtpAgent({
				service: "https://bsky.social",
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
		(<HTMLElement>document.getElementById("log")).textContent = "取得中・・・";
		(<HTMLElement>document.getElementById("error")).textContent = "";
		const emailInput = <HTMLInputElement>document.getElementById("email");
		const passwordInput = <HTMLInputElement>document.getElementById("password");
		const account = <HTMLInputElement>document.getElementById("account");
		if (!emailInput.value || !passwordInput.value || !account.value){
			return;
		}
		getProfileButton.disabled = true;
		const main = async () => {
			const agent = new AtpAgent({
				service: "https://bsky.social",
			});
			const actor = account.value + '.bsky.social';
			await agent.login({
				identifier: emailInput.value,
				password: passwordInput.value,
			});
			const prof = await agent.api.app.bsky.actor.getProfile({actor: actor});
			const avatardt = <HTMLElement>document.getElementById("avatar-dt");
			avatardt.innerHTML = "";
			const img = <HTMLImageElement>document.createElement("img");
			img.setAttribute("src", prof.data.avatar || "");
			img.setAttribute("width", "50");
			img.setAttribute("height", "50");
			avatardt.appendChild(img);
			const avatar = <HTMLInputElement>document.getElementById("avatar");
			avatar.value = prof.data.avatar || "";
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
		(<HTMLElement>document.getElementById("log")).textContent = "設定中・・・";
		(<HTMLElement>document.getElementById("error")).textContent = "";
		const emailInput = <HTMLInputElement>document.getElementById("email");
		const passwordInput = <HTMLInputElement>document.getElementById("password");
		const account = <HTMLInputElement>document.getElementById("account");
		if (!emailInput.value || !passwordInput.value || !account.value){
			return;
		}
		setProfileButton.disabled = true;
		const main = async () => {
			const agent = new AtpAgent({
				service: "https://bsky.social",
			});
			const actor = account.value + '.bsky.social';
			await agent.login({
				identifier: emailInput.value,
				password: passwordInput.value,
			});
			const avatar = <HTMLInputElement>document.getElementById("avatar");
			const displayName = <HTMLInputElement>document.getElementById("displayname");
			const description = <HTMLInputElement>document.getElementById("description");

			const response = await fetch(avatar.value);

			const contentType = response.headers.get("content-type") || "";
			const iconImageBlob: Blob = await response.blob();
			const arrayBuffer: ArrayBuffer = await iconImageBlob.arrayBuffer();
			const iconImage: Uint8Array = new Uint8Array(arrayBuffer);

			const uploadIconResp = await agent.api.com.atproto.blob.upload(iconImage, {
				encoding: contentType,
			});
			const createProfileResp = await agent.api.app.bsky.actor.updateProfile({
				displayName: displayName.value,
				description: description.value,
				avatar: { cid: uploadIconResp.data.cid, mimeType: contentType },
				banner: null
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
