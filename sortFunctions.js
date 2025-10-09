// ---------- 알고리즘 제너레이터 ----------
function* bubbleSort(a){
	const arr = a.slice();
	const n = arr.length;
	for(let i=0;i<n-1;i++){
		for(let j=0;j<n-1-i;j++){
			yield {type:'compare',i:j,j:j+1};
			if(arr[j]>arr[j+1]){
				[arr[j],arr[j+1]]=[arr[j+1],arr[j]];
				yield {type:'swap',i:j,j:j+1,arr:arr.slice()};
			}
		}
		yield {type:'mark',i:n-1-i};
	}
	yield {type:'done',arr:arr.slice()};
}

function* selectionSort(a){
	const arr = a.slice();
	const n = arr.length;
	for(let i=0;i<n;i++){
		let minIdx = i;
		for(let j=i+1;j<n;j++){
			yield {type:'compare',i:minIdx,j};
			if(arr[j]<arr[minIdx]) minIdx=j;
		}
		if(minIdx!==i){
			[arr[i],arr[minIdx]]=[arr[minIdx],arr[i]];
			yield {type:'swap',i,j:minIdx,arr:arr.slice()};
		}
		yield {type:'mark',i};
	}
	yield {type:'done',arr:arr.slice()};
}

function* insertionSort(a){
	const arr = a.slice();
	for(let i=1;i<arr.length;i++){
		let j=i;
		while(j>0){
			yield {type:'compare',i:j-1,j};
			if(arr[j-1]>arr[j]){
				[arr[j-1],arr[j]]=[arr[j],arr[j-1]];
				yield {type:'swap',i:j-1,j,arr:arr.slice()};
			} else break;
			j--;
		}
		yield {type:'mark',i};
	}
	yield {type:'done',arr:arr.slice()};
}

function* mergeSort(a){
	const arr = a.slice();
	const n = arr.length;
	function* merge(l,m,r){
		const left = arr.slice(l,m+1);
		const right = arr.slice(m+1,r+1);
		let i=0,j=0,k=l;
		while(i<left.length && j<right.length){
			yield {type:'compare',i:l+i,j:m+1+j};
			if(left[i]<=right[j]){
				arr[k]=left[i++];
				yield {type:'overwrite',i:k,value:arr[k],arr:arr.slice()};
			} else {
				arr[k]=right[j++];
				yield {type:'overwrite',i:k,value:arr[k],arr:arr.slice()};
			}
			k++;
		}
		while(i<left.length){
			arr[k]=left[i++];
			yield {type:'overwrite',i:k,value:arr[k],arr:arr.slice()};
			k++;
		}
		while(j<right.length){
			arr[k]=right[j++];
			yield {type:'overwrite',i:k,value:arr[k],arr:arr.slice()};
			k++;
		}
	}
	function* rec(l,r){
		if(l>=r) return;
		const m=Math.floor((l+r)/2);
		yield* rec(l,m);
		yield* rec(m+1,r);
		yield* merge(l,m,r);
	} 
	yield* rec(0,n-1);
	yield {type:'done',arr:arr.slice()};
}

function* quickSort(a){
	const arr = a.slice();
	const stack = [[0,arr.length-1]];
	while(stack.length){
		const [lo,hi] = stack.pop();
		if(lo>=hi) continue;
		const pivot = arr[hi];
		let i = lo;
		for(let j=lo;j<hi;j++){
			yield {type:'compare',i:j,j:hi};
			if(arr[j]<pivot){
				[arr[i],arr[j]] = [arr[j],arr[i]];
				yield {type:'swap',i,j,arr:arr.slice()};
				i++;
			}
		}
		[arr[i],arr[hi]]=[arr[hi],arr[i]];
		yield {type:'swap',i,j:hi,arr:arr.slice()};
		stack.push([lo,i-1]);
		stack.push([i+1,hi]);
	}
	yield {type:'done',arr:arr.slice()};
}

function* heapSort(a){
	const arr = a.slice();
	const n = arr.length;
	function* heapify(len,i){
		let largest=i; const l=2*i+1, r=2*i+2;
		if(l<len){
			yield {type:'compare',i:l,j:largest};
			if(arr[l]>arr[largest]) largest=l;
		}
		if(r<len){
			yield {type:'compare',i:r,j:largest};
			if(arr[r]>arr[largest]) largest=r;
		}
		if(largest!==i){
			[arr[i],arr[largest]]=[arr[largest],arr[i]];
			yield {type:'swap',i,j:largest,arr:arr.slice()};
			yield* heapify(len,largest);
		}
	}
	for(let i=Math.floor(n/2)-1;i>=0;i--) yield* heapify(n,i);
	for(let i=n-1;i>0;i--){
		[arr[0],arr[i]]=[arr[i],arr[0]];
		yield {type:'swap',i:0,j:i,arr:arr.slice()};
		yield* heapify(i,0);
		yield {type:'mark',i};
	}
	yield {type:'done',arr:arr.slice()};
}

function getGenerator(name,arr){
	switch(name){
		case 'Bubble Sort': return bubbleSort(arr);
		case 'Selection Sort': return selectionSort(arr);
		case 'Insertion Sort': return insertionSort(arr);
		case 'Merge Sort': return mergeSort(arr);
		case 'Quick Sort': return quickSort(arr);
		case 'Heap Sort': return heapSort(arr);
		default: return bubbleSort(arr);
	}
}

export { bubbleSort, selectionSort, insertionSort, mergeSort, quickSort, heapSort, getGenerator };
