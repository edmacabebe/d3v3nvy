
IMAGE_NAME = slush-marklogic-node

.PHONY: build
build:
	docker build --rm=true -t $(IMAGE_NAME) .

.PHONY: test
test:
	docker build -t $(IMAGE_NAME)-candidate .
	IMAGE_NAME=$(IMAGE_NAME)-candidate test/run
