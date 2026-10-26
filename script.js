let selectedVariant='new';
const accessoryFiles=["akcesorium-kask-ronin","akcesorium-zestaw-czyszczacy","akcesorium-uchwyt-na-telefon"];

'use strict';
const money = value => value.toLocaleString('pl-PL',{minimumFractionDigits:2,maximumFractionDigits:2})+' zł';
const services=[
['Montaż stacyjki',299,'wyposazenie-stacyjka','Montaż stacyjki umożliwiającej uruchamianie hulajnogi kluczykiem. Usługa obejmuje instalację oraz sprawdzenie działania.',true],
['Dodatkowe doszczelnienie',349,'serwis-doszczelnienie','Dodatkowe zabezpieczenie wybranych połączeń i elementów przed wilgocią. Nie oznacza pełnej wodoodporności hulajnogi.',true],
['Montaż GPS',499,'wyposazenie-gps','Instalacja lokalizatora GPS i sprawdzenie jego działania. Szczegóły aktywacji i ewentualnego abonamentu wymagają potwierdzenia.',false],
['Montaż wideorejestratora',699,'wyposazenie-wideorejestrator','Montaż wideorejestratora, dopasowanie jego ustawienia i kontrola nagrywania.',false],
['Montaż alarmu',499,'wyposazenie-alarm','Instalacja alarmu i sprawdzenie działania zabezpieczenia.',false]
];
document.querySelector('#services').innerHTML=services.map(([name,price,file,description,popular],i)=>`<div class="service-row"><label class="option"><input type="checkbox" data-price="${price}" aria-label="${name}"><img class="option-image" src="img/${file}.png" alt="" width="600" height="600"><span><strong>${name}</strong>${popular?'<span class="popular">NAJCZĘŚCIEJ WYBIERANE</span>':''}<em>${money(price)}</em></span></label><span class="service-help"><button type="button" aria-label="Informacje: ${name}" aria-describedby="service-help-${i}">?</button><span class="service-tooltip" role="tooltip" id="service-help-${i}">${description}</span></span></div>`).join('');
const accessoryItems=[['Kask szczękowy Kamikaze RONIN',349,'akcesorium-kask-ronin'],['Zestaw czyszczący Mr. Motus Box',69.99,'akcesorium-zestaw-czyszczacy'],['Uchwyt na telefon PRO RUPTOR',49,'akcesorium-uchwyt-na-telefon'],['Zapięcie do hulajnogi',null,'akcesorium-zapiecie'],['Rękawice do jazdy',null,'akcesorium-rekawice']];
document.querySelector('#accessories').innerHTML=accessoryItems.map(([name,price,file])=>`<article class="accessory"><img src="img/${file}.png" alt="${name}" width="600" height="600"><p>${name}</p><strong>${price===null?'Cena wkrótce':money(price)}</strong><button aria-label="Dodaj: ${name}" aria-pressed="false" data-price="${price||0}">DODAJ</button></article>`).join('')+'<article class="accessory accessory-more"><button class="demo-action"><span aria-hidden="true">+</span>Zobacz więcej</button></article>';
const faqItems=[['Ile trwa gwarancja?','Gwarancja wynosi 24 miesiące. Szczegółowy zakres ochrony oraz warunki znajdują się w dokumencie gwarancyjnym.'],['Czy hulajnoga jest legalna w Polsce?','Możliwość korzystania z hulajnogi na drogach publicznych zależy od zgodności konkretnej wersji pojazdu z obowiązującymi wymaganiami oraz od uprawnień użytkownika. Przed zakupem potwierdź z obsługą sklepu zgodność wybranego wariantu.'],['Jak szybko zamówienie zostanie wysłane?','Wysyłka produktów dostępnych w magazynie jest planowana w ciągu 48 godzin. Usługi dodatkowe mogą wydłużyć czas przygotowania zamówienia.'],['Czy mogę dokupić części i skorzystać z serwisu?','Tak, sklep oferuje części zamienne oraz obsługę serwisową. Dostępność konkretnej części i termin realizacji potwierdzisz z obsługą.'],['Jak przygotować hulajnogę do pierwszej jazdy?','Zapoznaj się z instrukcją, sprawdź mocowania, hamulce i ciśnienie w oponach oraz naładuj akumulator zgodnie z zaleceniami producenta.']];
document.querySelector('#faq').innerHTML=faqItems.map(([q,answer],i)=>`<details><summary>${i+1}. ${q}</summary><p>${answer}</p></details>`).join('');
const photos=Array.from({length:10},(_,i)=>`img/kamikaze-k1-plus-nightmare-${String(i+1).padStart(2,'0')}.png`);
const videos=['opVMHShXKnc','J4WT-T7HzX4','DPQ8Qy2-2hw','yBb76qG_hwM','n9o2A5eVcOE'];
let current=0,videoIndex=0,mode='Zdjęcia',photoPage=0,slideshow;
const thumbs=document.querySelector('.thumbnails');
const hero=document.querySelector('.hero');
const heroImage=document.querySelector('.hero-image');
const strip=document.querySelector('.thumb-strip');
const expand=document.querySelector('.expand');
const frame=document.createElement('iframe');
frame.className='youtube-player';frame.title='Film Kamikaze K1 Plus Nightmare';
frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';frame.hidden=true;
hero.append(frame);
const localVideo=document.createElement('video');
localVideo.className='rotation-player';localVideo.controls=false;localVideo.muted=true;localVideo.autoplay=true;localVideo.loop=true;localVideo.playsInline=true;localVideo.preload='none';localVideo.hidden=true;
localVideo.innerHTML='<source src="videos/360.mp4" type="video/mp4">Twoja przeglądarka nie obsługuje tego filmu.';
hero.append(localVideo);
function renderThumbnails(){
 strip.hidden=mode==='3D';
 thumbs.classList.toggle('video-thumbnails',mode==='Wideo');
 thumbs.innerHTML=mode==='Wideo'?videos.map((id,i)=>`<button class="thumb video-thumb ${i===videoIndex?'active':''}" data-index="${i}" aria-label="Pokaż film ${i+1}" aria-pressed="${i===videoIndex}"><span class="video-play" aria-hidden="true">▶</span><span>Film ${i+1}</span></button>`).join(''):photos.map((src,i)=>`<button class="thumb ${i===current?'active':''}" data-index="${i}" aria-label="Pokaż zdjęcie ${i+1}" aria-pressed="${i===current}"><img src="${src}" alt="Zdjęcie ${i+1}" width="600" height="600"></button>`).join('');
 document.querySelector('.next-thumb').hidden=mode!=='Zdjęcia';document.querySelector('.previous-thumb').hidden=mode!=='Zdjęcia';
 if(mode==='Zdjęcia')requestAnimationFrame(()=>scrollToPage(photoPage));
}
function visiblePhotos(){return matchMedia('(max-width:850px)').matches?4:5;}
function scrollToPage(page){
 const count=visiblePhotos(),max=photos.length-count;photoPage=Math.max(0,Math.min(page,max));
 const target=thumbs.children[photoPage];if(target)thumbs.scrollTo({left:target.offsetLeft-thumbs.children[0].offsetLeft,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 updatePhotoArrows();
}
function selectImage(index){
 current=index;heroImage.classList.remove('image-enter');heroImage.src=photos[index];requestAnimationFrame(()=>heroImage.classList.add('image-enter'));heroImage.alt=`Zdjęcie hulajnogi ${index+1}`;
 document.querySelector('.preview-image').src=photos[index];
 document.querySelector('#hero-label').textContent=heroImage.alt;
 thumbs.querySelectorAll('button').forEach((b,i)=>{b.classList.toggle('active',i===index);b.setAttribute('aria-pressed',String(i===index));});
 const first=thumbs.children[0],step=thumbs.children[1]?thumbs.children[1].offsetLeft-first.offsetLeft:1;const visibleStart=Math.round(thumbs.scrollLeft/step);if(index<visibleStart||index>=visibleStart+visiblePhotos())scrollToPage(Math.min(index,photos.length-visiblePhotos()));
}
function selectVideo(index){
 videoIndex=index;frame.src=`https://www.youtube.com/embed/${videos[index]}?rel=0&playsinline=1`;
 thumbs.querySelectorAll('button').forEach((b,i)=>{b.classList.toggle('active',i===index);b.setAttribute('aria-pressed',String(i===index));});
}
function pauseSlideshow(){clearInterval(slideshow);slideshow=null;}
function startSlideshow(){pauseSlideshow();if(mode!=='Zdjęcia'||document.hidden||document.querySelector('#preview').open||matchMedia('(prefers-reduced-motion: reduce)').matches||(matchMedia('(hover:hover)').matches&&(hero.matches(':hover')||strip.matches(':hover')))||hero.contains(document.activeElement)||strip.contains(document.activeElement))return;slideshow=setInterval(()=>selectImage((current+1)%photos.length),3000);}
function setMode(next){
 pauseSlideshow();mode=next;hero.dataset.mode=mode;
 frame.removeAttribute('src');localVideo.pause();frame.hidden=mode!=='Wideo';localVideo.hidden=mode!=='3D';heroImage.hidden=mode!=='Zdjęcia';expand.hidden=mode!=='Zdjęcia';
 // Product badges belong to the title and remain visible in every gallery mode.
 document.querySelectorAll('[role=tab]').forEach(t=>{t.setAttribute('aria-selected',String(t.dataset.mode===mode));t.tabIndex=t.dataset.mode===mode?0:-1;});
 renderThumbnails();if(mode==='3D'){localVideo.muted=true;localVideo.play().catch(()=>{});}if(mode==='Wideo')selectVideo(videoIndex);if(mode==='Zdjęcia'){selectImage(current);startSlideshow();}
}
thumbs.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(mode==='Wideo')selectVideo(Number(b.dataset.index));else{selectImage(Number(b.dataset.index));startSlideshow();}});
document.querySelector('.next-thumb').addEventListener('click',()=>movePhotos(1));
document.querySelector('.previous-thumb').addEventListener('click',()=>movePhotos(-1));
function movePhotos(direction){const first=thumbs.children[0],second=thumbs.children[1];if(!first||!second)return;const step=second.offsetLeft-first.offsetLeft;scrollToPage(Math.round(thumbs.scrollLeft/step)+direction*visiblePhotos());}
function updatePhotoArrows(){const previous=document.querySelector('.previous-thumb'),next=document.querySelector('.next-thumb');previous.disabled=thumbs.scrollLeft<2;next.disabled=thumbs.scrollLeft>=thumbs.scrollWidth-thumbs.clientWidth-2;next.textContent='›';next.setAttribute('aria-label','Następne zdjęcia');}
thumbs.addEventListener('scroll',updatePhotoArrows,{passive:true});
document.querySelectorAll('[role=tab]').forEach((b,i,all)=>{b.addEventListener('click',()=>setMode(b.dataset.mode));b.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?all.length-1:(i+(e.key==='ArrowRight'?1:-1)+all.length)%all.length;all[next].focus();setMode(all[next].dataset.mode);});});
[hero,strip].forEach(el=>{el.addEventListener('mouseenter',pauseSlideshow);el.addEventListener('mouseleave',startSlideshow);el.addEventListener('focusin',pauseSlideshow);el.addEventListener('focusout',()=>setTimeout(startSlideshow,0));el.addEventListener('touchstart',pauseSlideshow,{passive:true});el.addEventListener('touchend',startSlideshow,{passive:true});});
document.addEventListener('visibilitychange',startSlideshow);
document.querySelector('#preview').addEventListener('close',startSlideshow);
expand.addEventListener('click',pauseSlideshow);
window.addEventListener('resize',()=>{if(mode==='Zdjęcia')scrollToPage(photoPage);});
setMode('Zdjęcia');

document.querySelectorAll('.variant').forEach((button,i)=>{
 const isCurrent=i===0;button.classList.toggle('selected',isCurrent);button.setAttribute('aria-pressed',String(isCurrent));button.removeAttribute('aria-expanded');button.removeAttribute('aria-controls');
 button.setAttribute('aria-label',button.querySelector('strong').textContent.trim()+(isCurrent?' — wybrany model':''));
 if(isCurrent){button.setAttribute('aria-current','true');}
 else button.addEventListener('click',()=>{const toast=document.querySelector('.toast');toast.textContent='Podgląd projektu — przejście do tego modelu nie jest jeszcze podłączone.';toast.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('visible'),2600);});
});
const quantity=document.querySelector('#quantity');
function normalize(){quantity.value=Math.max(1,Math.min(99,parseInt(quantity.value,10)||1));updateTotal();}
function updateTotal(){refreshVariantPurchase();}
document.querySelector('#increase').addEventListener('click',()=>{quantity.value=Number(quantity.value)+1;normalize();});
document.querySelector('#decrease').addEventListener('click',()=>{quantity.value=Number(quantity.value)-1;normalize();});quantity.addEventListener('change',normalize);
document.querySelectorAll('.option input').forEach(c=>c.addEventListener('change',updateTotal));
document.querySelectorAll('.accessory button[data-price]').forEach(b=>b.addEventListener('click',()=>{const selected=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(selected));b.textContent=selected?'DODANO ✓':'DODAJ';updateTotal();}));
const dialog=document.querySelector('#preview');document.querySelector('.expand').addEventListener('click',()=>dialog.showModal());document.querySelector('.close-preview').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
let toastTimer;document.querySelectorAll('.cart-button,.text-button,.product-footer button:not(.share-product),.header nav button,.header-tools .desktop-tool,.header-tools button[aria-label="Szukaj"]').forEach(b=>b.addEventListener('click',()=>{const toast=document.querySelector('.toast');toast.textContent='Podgląd projektu — ta akcja nie jest jeszcze podłączona.';toast.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('visible'),2400);}));

const carousel=document.querySelector('#accessories');
function moveAccessories(direction){const card=carousel.querySelector('.accessory');carousel.scrollBy({left:direction*(card.getBoundingClientRect().width+8)*3,behavior:'smooth'});}
document.querySelector('.next-accessories').addEventListener('click',()=>moveAccessories(1));document.querySelector('.previous-accessories').addEventListener('click',()=>moveAccessories(-1));
function updateAccessoryArrows(){document.querySelector('.previous-accessories').disabled=carousel.scrollLeft<2;document.querySelector('.next-accessories').disabled=carousel.scrollLeft>=carousel.scrollWidth-carousel.clientWidth-2;}carousel.addEventListener('scroll',updateAccessoryArrows,{passive:true});window.addEventListener('resize',updateAccessoryArrows);requestAnimationFrame(updateAccessoryArrows);
const floating=document.querySelector('.floating-purchase');const cartButton=document.querySelector('.cart-button');function updateFloating(){floating.hidden=matchMedia('(max-width:850px)').matches?false:cartButton.getBoundingClientRect().bottom>=0;const totalText=money(configuredTotal()).replace('zł',selectedVariant==='es'?'PLN':'zł');if(document.querySelector('.floating-price').textContent!==totalText)document.querySelector('.floating-price').textContent=totalText;}window.addEventListener('scroll',updateFloating,{passive:true});window.addEventListener('resize',updateFloating);new MutationObserver(updateFloating).observe(cartButton,{childList:true,characterData:true,subtree:true});updateFloating();
document.querySelectorAll('.demo-action:not(.share-product)').forEach(b=>b.addEventListener('click',()=>{const toast=document.querySelector('.toast');toast.textContent='Podgląd projektu — ta akcja nie jest jeszcze podłączona.';toast.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('visible'),2400);}));
document.querySelectorAll('.service-help button').forEach(button=>button.addEventListener('click',()=>{const parent=button.parentElement;const open=parent.classList.toggle('help-open');button.setAttribute('aria-expanded',String(open));}));

const hamburger=document.querySelector('.hamburger');
const navigation=document.querySelector('#mobile-navigation');
hamburger.addEventListener('click',()=>{const open=hamburger.getAttribute('aria-expanded')!=='true';hamburger.setAttribute('aria-expanded',String(open));hamburger.setAttribute('aria-label',open?'Zamknij menu':'Otwórz menu');navigation.classList.toggle('mobile-open',open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){hamburger.setAttribute('aria-expanded','false');navigation.classList.remove('mobile-open');document.querySelector('.brand').classList.remove('brand-open');}});
document.querySelector('.brand-trigger').addEventListener('click',()=>{const brand=document.querySelector('.brand');const open=brand.classList.toggle('brand-open');document.querySelector('.brand-trigger').setAttribute('aria-expanded',String(open));});
document.addEventListener('click',e=>{if(!e.target.closest('.brand')){document.querySelector('.brand').classList.remove('brand-open');document.querySelector('.brand-trigger').setAttribute('aria-expanded','false');}});
const zoomStage=document.querySelector('.zoom-stage'),zoomImage=document.querySelector('.preview-image'),lens=document.querySelector('.magnifier');
let zoomScale=1,zoomX=0,zoomY=0,gesture=null;
const pointers=new Map();
function paintZoom(){const rect=zoomStage.getBoundingClientRect();zoomX=Math.min(0,Math.max(rect.width*(1-zoomScale),zoomX));zoomY=Math.min(0,Math.max(rect.height*(1-zoomScale),zoomY));zoomImage.style.transform=`translate(${zoomX}px,${zoomY}px) scale(${zoomScale})`;}
function resetZoom(){zoomScale=1;zoomX=zoomY=0;gesture=null;pointers.clear();paintZoom();lens.style.display='none';}
document.querySelector('.reset-zoom').addEventListener('click',resetZoom);
document.querySelector('.expand').addEventListener('click',resetZoom);
document.querySelector('#preview').addEventListener('close',resetZoom);
zoomStage.addEventListener('pointermove',e=>{
 if(e.pointerType==='mouse'&&matchMedia('(hover:hover)').matches&&!pointers.size){const r=zoomStage.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;const diameter=170;const factor=2.7;lens.style.display='block';lens.style.left=`${Math.max(0,Math.min(r.width-diameter,x-diameter/2))}px`;lens.style.top=`${Math.max(0,Math.min(r.height-diameter,y-diameter/2))}px`;lens.style.backgroundImage=`url("${zoomImage.src}")`;lens.style.backgroundSize=`${r.width*factor}px ${r.height*factor}px`;lens.style.backgroundPosition=`${diameter/2-x*factor}px ${diameter/2-y*factor}px`;return;}
 if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});const points=[...pointers.values()];const r=zoomStage.getBoundingClientRect();
 if(points.length===2&&gesture?.type==='pinch'){const distance=Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y);const center={x:(points[0].x+points[1].x)/2-r.left,y:(points[0].y+points[1].y)/2-r.top};zoomScale=Math.max(1,Math.min(5,gesture.scale*distance/gesture.distance));zoomX=center.x-gesture.imageX*zoomScale;zoomY=center.y-gesture.imageY*zoomScale;paintZoom();}
 else if(points.length===1&&gesture?.type==='pan'){zoomX=gesture.x+points[0].x-gesture.startX;zoomY=gesture.y+points[0].y-gesture.startY;paintZoom();}
});
function beginGesture(){const points=[...pointers.values()],r=zoomStage.getBoundingClientRect();if(points.length===2){const center={x:(points[0].x+points[1].x)/2-r.left,y:(points[0].y+points[1].y)/2-r.top};gesture={type:'pinch',distance:Math.max(1,Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y)),scale:zoomScale,imageX:(center.x-zoomX)/zoomScale,imageY:(center.y-zoomY)/zoomScale};}else if(points.length===1)gesture={type:'pan',startX:points[0].x,startY:points[0].y,x:zoomX,y:zoomY};else gesture=null;}
zoomStage.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')return;e.preventDefault();zoomStage.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});beginGesture();});
['pointerup','pointercancel'].forEach(type=>zoomStage.addEventListener(type,e=>{pointers.delete(e.pointerId);beginGesture();}));
zoomStage.addEventListener('pointerleave',()=>lens.style.display='none');
zoomStage.addEventListener('dblclick',e=>{if(e.pointerType==='mouse')return;zoomScale=zoomScale>1?1:2;zoomX=zoomScale>1?-zoomStage.clientWidth/2:0;zoomY=zoomScale>1?-zoomStage.clientHeight/2:0;paintZoom();});
window.addEventListener('resize',paintZoom);

// Preview variants. Edit dates and outlet condition here when final details are known.
const variantPreviewConfig={shippingDate:'Wysyłka od 01.01.2027.',outletCondition:'Stan produktu: powystawowy / po zwrocie — do uzupełnienia.'};
const variantLabels={new:'NOWOŚĆ',outlet:'OUTLET',preorder:'PRZEDSPRZEDAŻ',unavailable:'BRAK NA STANIE',es:'CERTIFICADO EN ESPAÑA'};
const variantPanel=document.querySelector('#variant-picker');
document.querySelector('.variant-launcher').addEventListener('click',()=>variantPanel.showModal());
document.querySelector('.close-variants').addEventListener('click',()=>variantPanel.close());
variantPanel.addEventListener('click',e=>{if(e.target===variantPanel)variantPanel.close();});
function configuredTotal(){return (3499+[...document.querySelectorAll('.option input:checked,.accessory button[aria-pressed=true]')].reduce((sum,b)=>sum+Number(b.dataset.price),0))*Number(quantity.value);}
function refreshVariantPurchase(){
 const buy=document.querySelector('.cart-button');const total=money(configuredTotal());
 const caption=selectedVariant==='unavailable'?'POWIADOM MNIE O DOSTĘPNOŚCI':selectedVariant==='preorder'?'KUP W PRZEDSPRZEDAŻY - '+total:'DODAJ DO KOSZYKA - '+total;
 if(buy.textContent!==caption)buy.textContent=caption;
 buy.classList.toggle('preorder-purchase',selectedVariant==='preorder');
 document.querySelector('.quantity').hidden=selectedVariant==='unavailable';
 document.querySelector('.payment-methods').hidden=selectedVariant==='unavailable';
 document.querySelector('.preorder-shipping').hidden=selectedVariant!=='preorder';
 document.querySelector('.installments').hidden=selectedVariant==='unavailable';
 document.querySelector('.installment-price-line').hidden=selectedVariant==='unavailable';
 document.querySelector('.floating-cart').classList.toggle('preorder-purchase',selectedVariant==='preorder');
 document.querySelector('.floating-cart').setAttribute('aria-label',selectedVariant==='unavailable'?'Powiadom mnie o dostępności':selectedVariant==='preorder'?'Kup w przedsprzedaży':'Dodaj do koszyka');
 document.querySelector('.floating-cart img').hidden=selectedVariant==='unavailable';
 document.querySelector('.availability-symbol').hidden=selectedVariant!=='unavailable';
 document.querySelector('.mobile-cart-label').textContent=selectedVariant==='unavailable'?'Powiadom o dostępności':selectedVariant==='preorder'?'Kup w przedsprzedaży':'Dodaj do koszyka';
 updateFloating();
}
function applyPreviewVariant(value){
 selectedVariant=value;document.documentElement.lang=value==='es'?'es':'pl';document.body.dataset.previewVariant=value;
 const badge=document.querySelector('.new');badge.querySelector('.status-label').textContent=variantLabels[value];
 const help=document.querySelector('.status-help');help.hidden=!['outlet','preorder'].includes(value);
 document.querySelector('.status-tooltip').textContent=value==='preorder'?variantPreviewConfig.shippingDate:variantPreviewConfig.outletCondition;
 document.querySelector('.dgt-info').hidden=value!=='es';
 document.querySelectorAll('[data-preview-variant]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.previewVariant===value)));
 refreshVariantPurchase();translatePage();document.dispatchEvent(new Event('productlanguagechange'));variantPanel.close();
}
document.querySelectorAll('[data-preview-variant]').forEach(button=>button.addEventListener('click',()=>applyPreviewVariant(button.dataset.previewVariant)));
document.querySelector('.status-help button').addEventListener('click',()=>document.querySelector('.status-help').classList.toggle('help-open'));
const translations={
'Opinie przykładowe':'Opiniones de ejemplo',

'Opinie klientów':'Opiniones de clientes','Przykładowe opinie do podglądu — treści wygenerowane, nie pochodzą z TrustMate.':'Opiniones de ejemplo para la vista previa: textos generados, no proceden de TrustMate.','Poprzednia opinia':'Opinión anterior','Następna opinia':'Opinión siguiente',

'Opcje produktu':'Opciones del producto','Zapisz':'Guardar','Zapisano':'Guardado','W porównaniu':'En la comparación','Dodano do porównania.':'Añadido a la comparación.','Usunięto z porównania.':'Eliminado de la comparación.','Zapisano produkt.':'Producto guardado.','Usunięto z zapisanych.':'Producto eliminado de los guardados.','Skopiowano link do produktu.':'Enlace del producto copiado.','Udostępnianie linku jest dostępne po uruchomieniu strony na serwerze.':'El enlace se puede compartir cuando la página se ejecute en un servidor.','lub':'o','× 30 rat':'× 30 cuotas',

'Wybierz swój model':'Elige tu modelo','Wybrany model':'Modelo seleccionado','Wygodnie na raty z':'Paga a plazos con','Rozłóż płatność na raty. Warunki dostępne przy wyborze płatności.':'Fracciona tu pago. Consulta las condiciones al elegir el método de pago.','Wygodne i bezpieczne płatności':'Pagos cómodos y seguros',

'Powiadom o dostępności':'Avísame cuando esté disponible','Zakup produktu':'Comprar producto','Pomoc i informacje':'Ayuda e información','Wybierz wariant':'Elegir variante','Zmień wariant':'Cambiar variante','Wariant podglądu':'Variante de vista previa','Zamknij wybór wariantu':'Cerrar selector de variantes','Nowość':'Novedad','Outlet':'Outlet','Przedsprzedaż':'Preventa','Brak na stanie':'Agotado',
'Hulajnogi elektryczne':'Patinetes eléctricos','Hulajnogi Elektryczne':'Patinetes eléctricos','Pojazdy':'Vehículos','Bestsellery':'Más vendidos','Części':'Recambios','Akcesoria':'Accesorios','Usługi':'Servicios','Smart home':'Hogar inteligente',
'Wysyłka w 48h':'Envío en 48 h','Szeroki wybór części':'Amplia selección de recambios','Profesjonalny serwis':'Servicio técnico profesional','Wsparcie w wyborze sprzętu':'Asesoramiento para elegir tu equipo',
'Galeria i funkcje':'Galería y características','Oferta Kamikaze':'Oferta Kamikaze','Oferta marki Kamikaze':'Oferta de la marca Kamikaze','ZOBACZ OFERTĘ':'VER OFERTA','NOWOŚĆ':'NOVEDAD','PRZEDSPRZEDAŻ':'PREVENTA','BRAK NA STANIE':'AGOTADO','Kliknij aby powiększyć':'Haz clic para ampliar','Zdjęcia':'Fotos','Wideo':'Vídeo','Rodzaj podglądu':'Tipo de vista','Miniatury':'Miniaturas',
'MOC NOMINALNA':'POTENCIA NOMINAL','Moc nominalna':'Potencia nominal','OPONY BEZDĘTKOWE':'NEUMÁTICOS TUBELESS','Opony bezdętkowe':'Neumáticos tubeless','ZASIĘG':'AUTONOMÍA','Zasięg':'Autonomía','Do 80 km':'Hasta 80 km','BATERIA':'BATERÍA','Bateria':'Batería','ZINTEGROWANE':'INTEGRADOS','Kierunkowskazy':'Intermitentes','WAGA':'PESO','Waga':'Peso','ZOBACZ WIĘCEJ':'VER MÁS',
'Konfiguracja produktu':'Configuración del producto','Stworzona dla tych, którzy oczekują więcej.':'Creado para quienes esperan más.','Opinie (11)':'Opiniones (11)','Sprawdź inne warianty':'Descubre otras variantes','Zdjęcie wariantu':'Imagen de la variante','Liczba sztuk':'Cantidad','Zmniejsz liczbę sztuk':'Reducir cantidad','Zwiększ liczbę sztuk':'Aumentar cantidad',
'Dodatkowe usługi':'Servicios adicionales','Montaż stacyjki':'Instalación de contacto con llave','Dodatkowe doszczelnienie':'Sellado adicional','Montaż GPS':'Instalación de GPS','Montaż wideorejestratora':'Instalación de cámara','Montaż alarmu':'Instalación de alarma','NAJCZĘŚCIEJ WYBIERANE':'MÁS ELEGIDO',
'Montaż stacyjki umożliwiającej uruchamianie hulajnogi kluczykiem. Usługa obejmuje instalację oraz sprawdzenie działania.':'Instalación de un contacto para encender el patinete con llave. El servicio incluye la instalación y la comprobación de funcionamiento.',
'Dodatkowe zabezpieczenie wybranych połączeń i elementów przed wilgocią. Nie oznacza pełnej wodoodporności hulajnogi.':'Protección adicional de determinadas uniones y componentes frente a la humedad. No implica que el patinete sea totalmente impermeable.',
'Instalacja lokalizatora GPS i sprawdzenie jego działania. Szczegóły aktywacji i ewentualnego abonamentu wymagają potwierdzenia.':'Instalación de un localizador GPS y comprobación de funcionamiento. Consulta los detalles de activación y las posibles cuotas.',
'Montaż wideorejestratora, dopasowanie jego ustawienia i kontrola nagrywania.':'Instalación de la cámara, ajuste de su posición y comprobación de la grabación.',
'Instalacja alarmu i sprawdzenie działania zabezpieczenia.':'Instalación de la alarma y comprobación del sistema de seguridad.',
'Uzupełnij swój zestaw':'Completa tu equipo','Kask szczękowy Kamikaze RONIN':'Casco integral Kamikaze RONIN','Zestaw czyszczący Mr. Motus Box':'Kit de limpieza Mr. Motus Box','Uchwyt na telefon PRO RUPTOR':'Soporte para móvil PRO RUPTOR','Zapięcie do hulajnogi':'Candado para patinete','Rękawice do jazdy':'Guantes para conducir','Cena wkrótce':'Precio próximamente','DODAJ':'AÑADIR','DODANO ✓':'AÑADIDO ✓','Zobacz więcej':'Ver más','Następne akcesoria':'Accesorios siguientes','Poprzednie akcesoria':'Accesorios anteriores',
'Dodatkowe informacje':'Información adicional','Korzyści zakupów':'Ventajas de compra','Wysyłka w 48H':'Envío en 48 h','Gwarancja 24 miesiące':'Garantía de 24 meses','Dostępne części zamienne':'Recambios disponibles','NAJCZĘŚCIEJ ZADAWANE PYTANIA':'PREGUNTAS FRECUENTES',
'Ile trwa gwarancja?':'¿Cuánto dura la garantía?','Gwarancja wynosi 24 miesiące. Szczegółowy zakres ochrony oraz warunki znajdują się w dokumencie gwarancyjnym.':'La garantía es de 24 meses. Consulta la cobertura y las condiciones detalladas en el documento de garantía.',
'Czy hulajnoga jest legalna w Polsce?':'¿Se puede circular legalmente con este patinete en España?',
'Możliwość korzystania z hulajnogi na drogach publicznych zależy od zgodności konkretnej wersji pojazdu z obowiązującymi wymaganiami oraz od uprawnień użytkownika. Przed zakupem potwierdź z obsługą sklepu zgodność wybranego wariantu.':'Antes de circular, comprueba los requisitos aplicables al vehículo y al conductor, así como las normas locales. Consulta con atención al cliente la documentación de la versión elegida.',
'Jak szybko zamówienie zostanie wysłane?':'¿Cuándo se enviará mi pedido?','Wysyłka produktów dostępnych w magazynie jest planowana w ciągu 48 godzin. Usługi dodatkowe mogą wydłużyć czas przygotowania zamówienia.':'Los productos disponibles en almacén se preparan para su envío en un plazo previsto de 48 horas. Los servicios adicionales pueden ampliar el plazo de preparación.',
'Czy mogę dokupić części i skorzystać z serwisu?':'¿Puedo comprar recambios y utilizar el servicio técnico?','Tak, sklep oferuje części zamienne oraz obsługę serwisową. Dostępność konkretnej części i termin realizacji potwierdzisz z obsługą.':'Sí, la tienda ofrece recambios y servicio técnico. Consulta con atención al cliente la disponibilidad de las piezas y los plazos.',
'Jak przygotować hulajnogę do pierwszej jazdy?':'¿Cómo preparar el patinete antes del primer uso?','Zapoznaj się z instrukcją, sprawdź mocowania, hamulce i ciśnienie w oponach oraz naładuj akumulator zgodnie z zaleceniami producenta.':'Lee el manual, revisa las fijaciones, los frenos y la presión de los neumáticos, y carga la batería siguiendo las instrucciones del fabricante.',
'Pobierz instrukcję (8Mb)':'Descargar manual (8 MB)','Udostępnij':'Compartir','Może Ci się spodobać':'También te puede gustar','Hulajnoga elektryczna':'Patinete eléctrico','ZOBACZ PRODUKT':'VER PRODUCTO','Szybki zakup':'Compra rápida','Dodaj do koszyka':'Añadir al carrito','Powiadom mnie o dostępności':'Avísame cuando esté disponible','Kup w przedsprzedaży':'Comprar en preventa',
'Powiększ zdjęcie':'Ampliar imagen','Powiększ podgląd':'Ampliar imagen','Zamknij podgląd':'Cerrar imagen','Powiększone zdjęcie produktu':'Imagen ampliada del producto','Najedź na zdjęcie, aby powiększyć. Na telefonie użyj dwóch palców.':'Pasa el cursor por la imagen para ampliarla. En el móvil utiliza dos dedos.','Resetuj powiększenie':'Restablecer zoom','Najważniejsze cechy produktu':'Características principales','Otwórz menu':'Abrir menú','Zamknij menu':'Cerrar menú','Kategorie':'Categorías','Szukaj':'Buscar','Porównaj':'Comparar','Ulubione':'Favoritos','Konto':'Mi cuenta','Koszyk':'Carrito','Następne zdjęcia':'Fotos siguientes','Poprzednie zdjęcia':'Fotos anteriores','Pokaż pierwsze zdjęcia':'Mostrar las primeras fotos','Pokaż kolejne zdjęcia':'Mostrar más fotos',
'Podgląd projektu — ta akcja nie jest jeszcze podłączona.':'Vista previa: esta acción todavía no está conectada.','Podgląd projektu - ta akcja nie jest jeszcze podłączona.':'Vista previa: esta acción todavía no está conectada.'
};
const originalText=new WeakMap(),originalAttributes=new WeakMap();
function spanish(text){let result=text;const prefix=result.match(/^(\d+\.\s*)(.*)$/s);if(prefix)return prefix[1]+spanish(prefix[2]);if(translations[result])return translations[result];
 result=result.replace(/Zdjęcia/g,'Fotos').replace(/Wideo/g,'Vídeo').replace(/Informacje o wariancie/g,'Información de la variante').replace(/Dostępne metody płatności/g,'Métodos de pago disponibles').replace(/Informacje o sklepie/g,'Información de la tienda').replace(/5 na 5 gwiazdek/g,'5 de 5 estrellas');
 result=result.replace('DODAJ DO KOSZYKA','AÑADIR AL CARRITO').replace('KUP W PRZEDSPRZEDAŻY','COMPRAR EN PREVENTA').replace('POWIADOM MNIE O DOSTĘPNOŚCI','AVÍSAME CUANDO ESTÉ DISPONIBLE').replace(/zł/g,'PLN');
 result=result.replace(/^(Pokaż zdjęcie|Zdjęcie hulajnogi|Zdjęcie) (\d+)$/,(_,label,n)=>`${label==='Pokaż zdjęcie'?'Mostrar foto':'Foto del patinete'} ${n}`).replace(/^(Pokaż film|Film) (\d+)$/,(_,label,n)=>`${label==='Pokaż film'?'Mostrar vídeo':'Vídeo'} ${n}`);
 if(result.startsWith('Informacje: '))return 'Información: '+spanish(result.slice(12));if(result.startsWith('Dodaj: '))return 'Añadir: '+spanish(result.slice(7));
 return result;
}
let translating=false,translationQueued=false;
function translatePage(){if(translating)return;translating=true;const isSpanish=selectedVariant==='es';const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;while(node=walker.nextNode()){
 if(['SCRIPT','STYLE'].includes(node.parentElement?.tagName)||node.parentElement?.closest('#variant-picker,.variant-launcher,.payment-logo,.payu-wordmark'))continue;let original=originalText.get(node);if(original===undefined){original=node.nodeValue;originalText.set(node,original);}const raw=original.trim();const translated=isSpanish?original.replace(raw,spanish(raw)):original;if(node.nodeValue!==translated)node.nodeValue=translated;
 }
 document.querySelectorAll('[aria-label],[alt],[title]').forEach(el=>{if(el.closest('#variant-picker,.variant-launcher'))return;let originals=originalAttributes.get(el);if(!originals){originals={};originalAttributes.set(el,originals);}for(const attr of ['aria-label','alt','title']){if(!el.hasAttribute(attr))continue;if(!(attr in originals)||(el.getAttribute(attr)!==originals[attr]&&el.getAttribute(attr)!==spanish(originals[attr])))originals[attr]=el.getAttribute(attr);const value=isSpanish?spanish(originals[attr]):originals[attr];if(el.getAttribute(attr)!==value)el.setAttribute(attr,value);}});
 document.title='Kamikaze K1 Plus Nightmare | 7way';translating=false;
}
new MutationObserver(()=>{if(translationQueued)return;translationQueued=true;queueMicrotask(()=>{translationQueued=false;translatePage();});}).observe(document.body,{childList:true,characterData:true,subtree:true});
applyPreviewVariant('new');
function productActionMessage(message){const toast=document.querySelector('.toast');toast.textContent=message;toast.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('visible'),2500);}
function toggleProductAction(button,activeLabel,inactiveLabel,key){const active=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(active));button.querySelector('span').textContent=active?activeLabel:inactiveLabel;try{localStorage.setItem(key,JSON.stringify(active));}catch{}return active;}
const saveButton=document.querySelector('.save-product');
try{if(JSON.parse(localStorage.getItem('7way.saved.k1plus')||'false')){saveButton.setAttribute('aria-pressed','true');saveButton.querySelector('span').textContent='Zapisano';}}catch{}
saveButton.addEventListener('click',()=>{const saved=toggleProductAction(saveButton,'Zapisano','Zapisz','7way.saved.k1plus');productActionMessage(saved?'Zapisano produkt.':'Usunięto z zapisanych.');});
document.querySelector('.compare-product').addEventListener('click',e=>{const selected=toggleProductAction(e.currentTarget,'W porównaniu','Porównaj','7way.compare.k1plus');productActionMessage(selected?'Dodano do porównania.':'Usunięto z porównania.');});
document.querySelectorAll('.share-product').forEach(button=>button.addEventListener('click',async()=>{if(location.protocol==='file:'){productActionMessage('Udostępnianie linku jest dostępne po uruchomieniu strony na serwerze.');return;}try{if(navigator.share){await navigator.share({title:document.title,url:location.href});}else if(navigator.clipboard){await navigator.clipboard.writeText(location.href);productActionMessage('Skopiowano link do produktu.');}else productActionMessage('Udostępnianie linku jest dostępne po uruchomieniu strony na serwerze.');}catch(error){if(error.name!=='AbortError')productActionMessage('Udostępnianie linku jest dostępne po uruchomieniu strony na serwerze.');}}));

// Demonstration copy only: replace with genuine review data before publishing.
const reviewExamples=[
{user:'MiejskiPodroznik',pl:['Wygodnie na codziennych trasach','Bardzo przyjemnie korzysta mi się z tego modelu na co dzień. Doceniam wygodę jazdy i staranne wykończenie.'],es:['Cómodo para el día a día','Me resulta muy agradable utilizar este modelo a diario. Valoro la comodidad y el cuidado de los acabados.']},
{user:'Kamil_R',pl:['Udany wybór','Wygląd na żywo zrobił na mnie świetne wrażenie. Całość prezentuje się solidnie i daje dużo przyjemności z jazdy.'],es:['Una buena elección','Su aspecto en persona me ha causado una gran impresión. Se ve sólido y resulta muy agradable de conducir.']},
{user:'AniaNaTrasie',pl:['Przemyślany model','Najbardziej podoba mi się wygodna pozycja i prostota obsługi. Chętnie wybieram go na krótsze wyjazdy.'],es:['Un modelo bien pensado','Lo que más me gusta es la posición cómoda y la facilidad de uso. Me encanta elegirlo para trayectos cortos.']},
{user:'Pawel_M',pl:['Świetne pierwsze wrażenie','Dobre wykonanie i dopracowane detale. Od pierwszej przejażdżki korzystanie z tego pojazdu sprawia mi dużo frajdy.'],es:['Una primera impresión excelente','Buena fabricación y detalles cuidados. Desde el primer paseo, disfrutar de este vehículo me resulta muy divertido.']},
{user:'NaDwochKolach',pl:['Chętnie wracam na trasę','To model, po który po prostu chce się sięgać. Podoba mi się jego stylistyka i to, jak przyjemnie się nim podróżuje.'],es:['Siempre apetece volver a salir','Es un modelo que apetece utilizar. Me gusta su diseño y lo agradable que resulta desplazarse con él.']}
];
let reviewIndex=0,reviewTimer,reviewHover=false;
const reviewPanel=document.querySelector('.customer-reviews');
function showReview(index){reviewIndex=(index+reviewExamples.length)%reviewExamples.length;const review=reviewExamples[reviewIndex],copy=review[selectedVariant==='es'?'es':'pl'];document.querySelector('.review-heading').textContent=copy[0];document.querySelector('.review-text').textContent=copy[1];document.querySelector('.review-username').textContent=review.user;document.querySelector('.review-avatar').textContent=review.user.slice(0,1);document.querySelector('.review-count').textContent=`${reviewIndex+1} / ${reviewExamples.length}`;const card=document.querySelector('.review-card');card.classList.remove('review-enter');requestAnimationFrame(()=>card.classList.add('review-enter'));}
function pauseReviews(){clearInterval(reviewTimer);reviewTimer=null;}
function resumeReviews(){pauseReviews();if(document.hidden||reviewHover||reviewPanel.contains(document.activeElement)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;reviewTimer=setInterval(()=>showReview(reviewIndex+1),7000);}
reviewPanel.addEventListener('mouseenter',()=>{reviewHover=true;pauseReviews();});reviewPanel.addEventListener('mouseleave',()=>{reviewHover=false;resumeReviews();});reviewPanel.addEventListener('focusin',pauseReviews);reviewPanel.addEventListener('focusout',()=>setTimeout(resumeReviews,0));
document.querySelector('.review-previous').addEventListener('click',()=>{showReview(reviewIndex-1);resumeReviews();});document.querySelector('.review-next').addEventListener('click',()=>{showReview(reviewIndex+1);resumeReviews();});
let reviewTouchX=null;reviewPanel.addEventListener('touchstart',e=>{reviewTouchX=e.touches[0].clientX;pauseReviews();},{passive:true});reviewPanel.addEventListener('touchend',e=>{if(reviewTouchX!==null){const dx=e.changedTouches[0].clientX-reviewTouchX;if(Math.abs(dx)>45)showReview(reviewIndex+(dx<0?1:-1));}reviewTouchX=null;reviewHover=false;resumeReviews();},{passive:true});document.addEventListener('visibilitychange',resumeReviews);document.addEventListener('productlanguagechange',()=>showReview(reviewIndex));showReview(0);resumeReviews();
