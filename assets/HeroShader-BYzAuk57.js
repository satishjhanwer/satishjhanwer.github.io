import{n as e}from"./rolldown-runtime-WkwZ5CU-.js";import{h as t,m as n,r}from"./motion-qa66RBhu.js";import{o as i}from"./a11yPrefs-Cnpdw7KT.js";import{c as a,l as o}from"./theme-BABHkJ_2.js";import{t as s}from"./Hero.module-CPLYD6LT.js";var c=e(t(),1),l=5,u=({reduceMotion:e,highContrast:t,saveData:n,cores:r})=>!e&&!t&&!n&&r>=l;function d(e){let[t=0,n=0,r=0]=(e.match(/\d*\.?\d+/g)??[]).map(Number);return e.startsWith(`color(`)?[t,n,r]:[t/255,n/255,r/255]}function f(){let e=document.createElement(`span`);e.style.display=`none`,document.body.append(e);let t=t=>(e.style.color=`var(${t})`,d(getComputedStyle(e).color)),n={primary:t(`--primary`),secondary:t(`--secondary`),light:document.documentElement.getAttribute(`data-mode`)===`light`};return e.remove(),n}var p=`attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }`,m=`
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_pointer;
uniform vec3 u_a;
uniform vec3 u_b;
uniform float u_strength;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
  return v;
}

void main() {
  vec2 aspect = vec2(u_res.x / u_res.y, 1.0);
  vec2 p = gl_FragCoord.xy / u_res * aspect * 1.6;
  float d = length(p - u_pointer * aspect * 1.6);
  float t = u_time * 0.05;
  vec2 warp = vec2(fbm(p + t), fbm(p - t + 3.1));
  float a = smoothstep(0.42, 0.85, fbm(p + 1.4 * warp + 0.35 * exp(-d * 1.6))) * u_strength;
  float b = smoothstep(0.5, 0.92, fbm(p * 1.3 - warp + vec2(t * 1.3, 0.0))) * u_strength * 0.8;
  b += 0.12 * u_strength * exp(-d * 2.4);
  float alpha = b + a * (1.0 - b);
  gl_FragColor = vec4(u_b * b + u_a * a * (1.0 - b), alpha);
}`;function h(e){let t=e.getContext(`webgl`,{antialias:!1,powerPreference:`low-power`});if(!t)return null;let n=t.createProgram();for(let[e,r]of[[t.VERTEX_SHADER,p],[t.FRAGMENT_SHADER,m]]){let i=t.createShader(e);t.shaderSource(i,r),t.compileShader(i),t.attachShader(n,i)}if(t.linkProgram(n),!t.getProgramParameter(n,t.LINK_STATUS))return null;t.useProgram(n),t.bindBuffer(t.ARRAY_BUFFER,t.createBuffer()),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),t.STATIC_DRAW);let r=t.getAttribLocation(n,`p`);t.enableVertexAttribArray(r),t.vertexAttribPointer(r,2,t.FLOAT,!1,0,0);let[i,a,o,s,c,l]=[`u_res`,`u_time`,`u_pointer`,`u_a`,`u_b`,`u_strength`].map(e=>t.getUniformLocation(n,e));return{resize(n){let r=Math.max(1,Math.round(e.clientWidth*n)),i=Math.max(1,Math.round(e.clientHeight*n));(e.width!==r||e.height!==i)&&(e.width=r,e.height=i,t.viewport(0,0,r,i))},draw(n,r,u){t.uniform2f(i,e.width,e.height),t.uniform1f(a,n),t.uniform2f(o,r.x,r.y),t.uniform3fv(s,u.primary),t.uniform3fv(c,u.secondary),t.uniform1f(l,u.light?.45:.7),t.drawArrays(t.TRIANGLES,0,3)},destroy(){t.getExtension(`WEBGL_lose_context`)?.loseContext()}}}var g=n(),_=1.5,v=.5,y=.04;function b(e){if(`requestIdleCallback`in window){let t=requestIdleCallback(e,{timeout:2e3});return()=>cancelIdleCallback(t)}let t=setTimeout(e,300);return()=>clearTimeout(t)}function x(){let e=(0,c.useRef)(null),t=(0,c.useRef)(null),n=r(),{highContrast:l}=i(),d=o(),p=a(),m=navigator.connection,x=u({reduceMotion:!!n,highContrast:l,saveData:!!m?.saveData,cores:navigator.hardwareConcurrency??8});return(0,c.useEffect)(()=>{t.current=null},[d,p]),(0,c.useEffect)(()=>{let n=e.current;if(!x||!n)return;let r=null,i=0,a=!0,o=performance.now(),s={x:.75,y:.6},c={...s},l=()=>r?.resize(Math.min(window.devicePixelRatio||1,_)*v),u=e=>{i=0,r&&a&&!document.hidden&&(s.x+=(c.x-s.x)*y,s.y+=(c.y-s.y)*y,t.current??=f(),r.draw((e-o)/1e3,s,t.current),i=requestAnimationFrame(u))},d=()=>{i||=requestAnimationFrame(u)},p=e=>{let t=n.getBoundingClientRect();c.x=(e.clientX-t.left)/t.width,c.y=1-(e.clientY-t.top)/t.height},m=b(()=>{r=h(n),r&&(l(),d(),n.setAttribute(`data-ready`,``))}),g=new IntersectionObserver(([e])=>{a=e.isIntersecting,d()});g.observe(n);let S=new ResizeObserver(l);return S.observe(n),window.addEventListener(`pointermove`,p,{passive:!0}),document.addEventListener(`visibilitychange`,d),()=>{m(),cancelAnimationFrame(i),g.disconnect(),S.disconnect(),window.removeEventListener(`pointermove`,p),document.removeEventListener(`visibilitychange`,d),r?.destroy(),n.removeAttribute(`data-ready`)}},[x]),x?(0,g.jsx)(`canvas`,{ref:e,className:s.shader,"aria-hidden":`true`}):null}export{x as HeroShader};