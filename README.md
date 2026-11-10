# 움직임 해부학 (Anatomy in Motion)

운동 지도 공부용 개인 웹앱입니다. 3D 인체 모델에서 뼈를 움직이며 근육 길이 변화, 체형 프리셋, 신경의 지배 근육과 포착 지점을 봅니다. 홈 화면 앱(PWA)으로 쓸 수 있습니다: **https://danggae.github.io/anatomy-viewer/**

의료 진단이나 치료 판단에 쓰는 자료가 아닙니다. 각도와 근육 패턴은 학습용으로 단순화한 모형입니다.

## iPhone에 설치

1. iPhone **Safari**로 https://danggae.github.io/anatomy-viewer/ 를 엶
2. 화면 위의 "오프라인용 저장 중… n/32"가 사라질 때까지 기다림 (약 15MB)
3. 공유 버튼 → **홈 화면에 추가**
4. 그다음부터는 **홈 화면 아이콘으로** 엶. 처음 열 때 인터넷이 되는 곳에서 한 번 열어 오른쪽 위 ⓘ → "오프라인 준비 완료"를 확인
   (iOS는 홈 화면 앱과 Safari 탭의 저장 공간이 따로라서, 홈 화면 앱이 파일을 다시 받음)

- 한 번 저장되면 인터넷 없이도 모든 레이어가 열림
- 새 버전을 올리면: 앱을 열 때 바뀐 파일만 뒤에서 받고 "새 버전이 준비됐습니다"가 뜸. 누르면 바로 적용, 안 누르면 앱을 완전히 닫았다 열 때 적용
- 내 프리셋·관절 중심 조정값은 폰 안(localStorage)에만 저장되고 여기에는 올라가지 않음

## 이 저장소

- 빌드된 앱 파일만 있습니다(`index.html`, `assets/`, `models/`, `data/`, `icons/`, `sw.js`, `manifest.webmanifest`).
- 소스 코드와 모델 변환 스크립트는 작업 폴더에 따로 있고, `tools/deploy.sh` 로 빌드해 이 저장소의 `main` 브랜치에 올립니다. GitHub Pages가 `main` 의 루트를 그대로 공개합니다.

## 출처와 라이선스

- 3D 모델: **Z-Anatomy - The libre 3D atlas of anatomy - CC BY-SA 4.0** — https://github.com/Z-Anatomy/Models-of-human-anatomy
- 원본 모델: **BodyParts3D - The Database Center for Life Science - CC BY-SA 2.1 Japan**
- 영문 설명문: **Wikipedia - CC BY-SA 3.0**

Z-Anatomy 원본에 함께 들어 있는 비상업 라이선스 모델(Anatomy of the Inner Ear — CC BY-NC-SA 4.0, Kidney — CC BY-NC 4.0)에서 온 부분은 넣지 않았습니다.

`models/`, `data/` 의 변환된 모델과 데이터는 원본과 같은 **CC BY-SA 4.0** 을 따릅니다. 바꾼 내용(레이어 분리, 메시 단순화·압축, 좌우 대칭 저장, 재질 단색화, 한글명 추가)은 앱의 정보(ⓘ) 화면에 적혀 있습니다.
